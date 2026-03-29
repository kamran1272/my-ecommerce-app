const memoryStore = (() => {
  const store = new Map();
  return {
    getItem: (key) => (store.has(key) ? store.get(key) : null),
    setItem: (key, value) => store.set(key, value),
    removeItem: (key) => store.delete(key),
  };
})();

export const APP_EVENTS = {
  authChanged: 'app:auth-changed',
  productsChanged: 'app:products-changed',
  ordersChanged: 'app:orders-changed',
  wishlistChanged: 'app:wishlist-changed',
};

export const isBrowser = typeof window !== 'undefined';

const localStorageAvailable = (() => {
  try {
    if (!isBrowser || !window.localStorage) return false;
    const testKey = '__storage_test__';
    window.localStorage.setItem(testKey, 'ok');
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
})();

const storage = localStorageAvailable ? window.localStorage : memoryStore;

export const safeJsonParse = (value, fallback = null) => {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

export const readValue = (key) => storage.getItem(key);

export const writeValue = (key, value) => {
  storage.setItem(key, value);
  return value;
};

export const removeValue = (key) => storage.removeItem(key);

export const readJson = (key, fallback) => safeJsonParse(readValue(key), fallback);

export const writeJson = (key, value) => {
  writeValue(key, JSON.stringify(value));
  return value;
};

export const dispatchAppEvent = (eventName, detail) => {
  if (!isBrowser) return;
  window.dispatchEvent(new CustomEvent(eventName, { detail }));
};

export const subscribeToWindowEvent = (eventName, handler) => {
  if (!isBrowser) return () => {};
  window.addEventListener(eventName, handler);
  return () => window.removeEventListener(eventName, handler);
};
