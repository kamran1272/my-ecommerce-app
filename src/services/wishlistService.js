import { APP_EVENTS, dispatchAppEvent, readJson, writeJson } from './storageService';
import { getCurrentUser } from './authService';

const getWishlistKey = () => {
  const user = getCurrentUser();
  return user?.email ? `wishlist_${user.email}` : 'wishlist_guest';
};

const saveWishlist = (wishlist) => {
  writeJson(getWishlistKey(), wishlist);
  dispatchAppEvent(APP_EVENTS.wishlistChanged, wishlist);
  return wishlist;
};

export const getWishlist = () => readJson(getWishlistKey(), []);

export const addWishlistItem = async (product) => {
  const wishlist = getWishlist();
  if (wishlist.some((item) => item.id === product.id)) return wishlist;
  return saveWishlist([...wishlist, product]);
};

export const removeWishlistItem = async (productId) =>
  saveWishlist(getWishlist().filter((item) => item.id !== productId));

export const toggleWishlistItem = async (product) => {
  const wishlist = getWishlist();
  return wishlist.some((item) => item.id === product.id)
    ? removeWishlistItem(product.id)
    : addWishlistItem(product);
};
