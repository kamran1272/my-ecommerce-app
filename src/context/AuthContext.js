import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { APP_EVENTS, subscribeToWindowEvent } from '../services/storageService';
import {
  clearCurrentUser,
  continueAsGuest,
  getCurrentUser,
  isAdminUser,
  loginUser,
  registerUser,
  updateCurrentUser,
} from '../services/authService';
import { mergeGuestCartIntoUser } from '../utils/cart';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => getCurrentUser());

  useEffect(() => {
    const syncUser = () => setUser(getCurrentUser());
    const offAuth = subscribeToWindowEvent(APP_EVENTS.authChanged, syncUser);
    const offStorage = subscribeToWindowEvent('storage', syncUser);
    return () => {
      offAuth();
      offStorage();
    };
  }, []);

  const login = useCallback(async (credentials) => {
    const nextUser = await loginUser(credentials);
    if (nextUser?.role !== 'guest') {
      mergeGuestCartIntoUser();
    }
    setUser(nextUser);
    return nextUser;
  }, []);

  const register = useCallback(async (payload) => {
    const nextUser = await registerUser(payload);
    mergeGuestCartIntoUser();
    setUser(nextUser);
    return nextUser;
  }, []);

  const loginAsGuest = useCallback(() => {
    const guestUser = continueAsGuest();
    setUser(guestUser);
    return guestUser;
  }, []);

  const logout = useCallback(() => {
    clearCurrentUser();
    setUser(null);
  }, []);

  const updateProfile = useCallback(async (updates) => {
    const nextUser = await updateCurrentUser(updates);
    setUser(nextUser);
    return nextUser;
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isAdmin: isAdminUser(user),
      login,
      register,
      loginAsGuest,
      logout,
      updateProfile,
    }),
    [login, loginAsGuest, logout, register, updateProfile, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider.');
  }
  return context;
};
