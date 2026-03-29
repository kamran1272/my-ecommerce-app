/**
 * Cart utility helpers backed by localStorage (with a safe in-memory fallback for SSR/tests).
 * - Keys are per-user when an email is present, otherwise a guest cart is used.
 * - All operations sanitize quantities (min 1) and merge duplicates.
 * - A custom `cart-changed` event is dispatched on write so listeners in the same tab can react.
 */

const memoryStore = (() => {
  const store = new Map();
  return {
    getItem: (key) => (store.has(key) ? store.get(key) : null),
    setItem: (key, value) => store.set(key, value),
    removeItem: (key) => store.delete(key),
  };
})();

const storageAvailable = (() => {
  try {
    if (typeof window === "undefined" || !window.localStorage) return false;
    const testKey = "__cart_test__";
    window.localStorage.setItem(testKey, "ok");
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
})();

const store = storageAvailable ? window.localStorage : memoryStore;

const safeParse = (value) => {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

export const getUser = () => {
  if (!storageAvailable) return null;
  const saved = store.getItem("user");
  return saved ? safeParse(saved) : null;
};

export const getCartKey = () => {
  const user = getUser();
  return user?.email ? `cart_${user.email}` : "cart_guest";
};

const sanitizeItems = (items = []) => {
  if (!Array.isArray(items)) return [];
  const map = new Map();

  items.forEach((item) => {
    if (!item || item.id === undefined || item.id === null) return;
    const quantity = Math.max(
      1,
      Number.isFinite(+item.quantity) ? +item.quantity : 1,
    );
    const price = Number.isFinite(+item.price) ? +item.price : 0;
    const existing = map.get(item.id) || { ...item, quantity: 0, price };
    map.set(item.id, {
      ...existing,
      ...item,
      quantity: (existing.quantity || 0) + quantity,
      price,
    });
  });

  return Array.from(map.values());
};

const dispatchCartEvent = () => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("cart-changed"));
  }
};

export const loadCart = () => {
  const raw = store.getItem(getCartKey());
  const parsed = safeParse(raw);
  return sanitizeItems(parsed || []);
};

export const saveCart = (items) => {
  const cleaned = sanitizeItems(items);
  try {
    store.setItem(getCartKey(), JSON.stringify(cleaned));
  } catch {
    // Ignore storage write failures (e.g., quota); keep in-memory state.
  }
  dispatchCartEvent();
  return cleaned;
};

export const addToCart = (product, quantity = 1) => {
  if (!product || product.id === undefined || product.id === null)
    return loadCart();
  const cart = loadCart();
  const qty = Math.max(1, Number.isFinite(+quantity) ? +quantity : 1);
  const index = cart.findIndex((item) => item.id === product.id);

  if (index >= 0) {
    cart[index] = {
      ...cart[index],
      ...product,
      quantity: cart[index].quantity + qty,
    };
  } else {
    cart.push({ ...product, quantity: qty });
  }

  return saveCart(cart);
};

export const updateQuantity = (productId, quantity) => {
  const qty = Math.max(1, Number.isFinite(+quantity) ? +quantity : 1);
  const cart = loadCart().map((item) =>
    item.id === productId ? { ...item, quantity: qty } : item,
  );
  return saveCart(cart);
};

export const removeFromCart = (productId) => {
  const cart = loadCart().filter((item) => item.id !== productId);
  return saveCart(cart);
};

export const clearCart = () => saveCart([]);

export const isInCart = (productId) =>
  loadCart().some((item) => item.id === productId);

export const getCartCount = () =>
  loadCart().reduce(
    (sum, item) => sum + (Number.isFinite(+item.quantity) ? +item.quantity : 0),
    0,
  );

export const getCartTotal = () =>
  loadCart().reduce(
    (sum, item) =>
      sum +
      (Number.isFinite(+item.price) ? +item.price : 0) *
        (Number.isFinite(+item.quantity) ? +item.quantity : 1),
    0,
  );

/**
 * Merge any existing guest cart into the current user's cart (call this right after login).
 */
export const mergeGuestCartIntoUser = () => {
  if (!storageAvailable) return [];
  const guestRaw = store.getItem("cart_guest");
  const guest = sanitizeItems(safeParse(guestRaw) || []);
  const userCart = loadCart();
  const merged = sanitizeItems([...guest, ...userCart]);
  store.removeItem("cart_guest");
  return saveCart(merged);
};
