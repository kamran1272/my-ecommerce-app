import {
  APP_EVENTS,
  dispatchAppEvent,
  readJson,
  removeValue,
  writeJson,
} from './storageService';

const CURRENT_USER_KEY = 'user';
const USERS_KEY = 'admin_users';

const defaultUsers = [
  { email: 'admin123@gmail.com', name: 'Admin', role: 'admin' },
  { email: 'manager@kamranlaptops.com', name: 'Manager', role: 'manager' },
];

const normalizeEmail = (email = '') => email.trim().toLowerCase();

export const listUsers = () => {
  const existing = readJson(USERS_KEY, null);
  if (existing?.length) return existing;
  writeJson(USERS_KEY, defaultUsers);
  return defaultUsers;
};

const saveUsers = (users) => writeJson(USERS_KEY, users);

export const getCurrentUser = () => readJson(CURRENT_USER_KEY, null);

export const isAdminUser = (user) => user?.role === 'admin';

export const saveCurrentUser = (user) => {
  writeJson(CURRENT_USER_KEY, user);
  dispatchAppEvent(APP_EVENTS.authChanged, user);
  return user;
};

export const clearCurrentUser = () => {
  removeValue(CURRENT_USER_KEY);
  dispatchAppEvent(APP_EVENTS.authChanged, null);
};

export const continueAsGuest = () => {
  const guestUser = {
    email: 'guest@user.com',
    name: 'Guest User',
    role: 'guest',
  };
  return saveCurrentUser(guestUser);
};

export const loginUser = async ({ email, password }) => {
  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail) throw new Error('Email is required.');
  if (!password?.trim()) throw new Error('Password is required.');

  if (normalizedEmail === 'admin123@gmail.com' && password !== 'admin123') {
    throw new Error('Invalid admin credentials.');
  }

  const users = listUsers();
  const existingUser = users.find((user) => normalizeEmail(user.email) === normalizedEmail);
  const nextUser = existingUser || {
    email: normalizedEmail,
    name: normalizedEmail.split('@')[0],
    role: 'user',
  };

  if (!existingUser) {
    saveUsers([...users, nextUser]);
  }

  return saveCurrentUser(nextUser);
};

export const registerUser = async ({ email, name }) => {
  const normalizedEmail = normalizeEmail(email);
  if (!normalizedEmail) throw new Error('Email is required.');

  const users = listUsers();
  const existingUser = users.find((user) => normalizeEmail(user.email) === normalizedEmail);
  if (existingUser) return saveCurrentUser(existingUser);

  const nextUser = {
    email: normalizedEmail,
    name: name?.trim() || normalizedEmail.split('@')[0],
    role: 'user',
  };

  saveUsers([...users, nextUser]);
  return saveCurrentUser(nextUser);
};

export const updateCurrentUser = async (updates) => {
  const currentUser = getCurrentUser();
  if (!currentUser) throw new Error('No active user session.');

  const nextUser = {
    ...currentUser,
    ...updates,
    email: normalizeEmail(updates?.email || currentUser.email),
  };

  const users = listUsers();
  const hasExistingUser = users.some(
    (user) => normalizeEmail(user.email) === normalizeEmail(currentUser.email)
  );

  const nextUsers = hasExistingUser
    ? users.map((user) =>
        normalizeEmail(user.email) === normalizeEmail(currentUser.email)
          ? { ...user, ...nextUser }
          : user
      )
    : [...users, nextUser];

  saveUsers(nextUsers);
  return saveCurrentUser(nextUser);
};
