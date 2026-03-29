import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { APP_EVENTS, subscribeToWindowEvent } from '../services/storageService';
import {
  addWishlistItem,
  getWishlist,
  removeWishlistItem,
  toggleWishlistItem,
} from '../services/wishlistService';

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState(() => getWishlist());

  useEffect(() => {
    const syncWishlist = () => setWishlist(getWishlist());
    const offWishlist = subscribeToWindowEvent(APP_EVENTS.wishlistChanged, syncWishlist);
    const offStorage = subscribeToWindowEvent('storage', syncWishlist);
    const offAuth = subscribeToWindowEvent(APP_EVENTS.authChanged, syncWishlist);
    return () => {
      offWishlist();
      offStorage();
      offAuth();
    };
  }, []);

  const wishlistIds = useMemo(() => new Set(wishlist.map((item) => item.id)), [wishlist]);

  const value = useMemo(
    () => ({
      wishlist,
      wishlistCount: wishlist.length,
      addToWishlist: async (product) => {
        const nextWishlist = await addWishlistItem(product);
        setWishlist(nextWishlist);
        return nextWishlist;
      },
      removeFromWishlist: async (productId) => {
        const nextWishlist = await removeWishlistItem(productId);
        setWishlist(nextWishlist);
        return nextWishlist;
      },
      toggleWishlist: async (product) => {
        const nextWishlist = await toggleWishlistItem(product);
        setWishlist(nextWishlist);
        return nextWishlist;
      },
      isInWishlist: (productId) => wishlistIds.has(productId),
    }),
    [wishlist, wishlistIds]
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider.');
  }
  return context;
};
