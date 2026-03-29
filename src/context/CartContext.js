import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  addToCart,
  clearCart,
  getCartCount,
  getCartTotal,
  isInCart,
  loadCart,
  removeFromCart,
  updateQuantity,
} from '../utils/cart';
import { APP_EVENTS, subscribeToWindowEvent } from '../services/storageService';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => loadCart());

  useEffect(() => {
    const syncCart = () => setCartItems(loadCart());
    const offCart = subscribeToWindowEvent('cart-changed', syncCart);
    const offStorage = subscribeToWindowEvent('storage', syncCart);
    const offAuth = subscribeToWindowEvent(APP_EVENTS.authChanged, syncCart);
    return () => {
      offCart();
      offStorage();
      offAuth();
    };
  }, []);

  const addItem = useCallback((product, quantity = 1) => {
    const nextCart = addToCart(product, quantity);
    setCartItems(nextCart);
    return nextCart;
  }, []);

  const updateItemQuantity = useCallback((productId, quantity) => {
    const nextCart = updateQuantity(productId, quantity);
    setCartItems(nextCart);
    return nextCart;
  }, []);

  const removeItem = useCallback((productId) => {
    const nextCart = removeFromCart(productId);
    setCartItems(nextCart);
    return nextCart;
  }, []);

  const clearItems = useCallback(() => {
    const nextCart = clearCart();
    setCartItems(nextCart);
    return nextCart;
  }, []);

  const value = useMemo(
    () => ({
      cartItems,
      cartCount: getCartCount(),
      cartTotal: getCartTotal(),
      addItem,
      updateItemQuantity,
      removeItem,
      clearItems,
      isInCart: (productId) => isInCart(productId),
    }),
    [addItem, cartItems, clearItems, removeItem, updateItemQuantity]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider.');
  }
  return context;
};
