import { STORAGE_KEYS } from "./constants";

/**
 * Gets the stored JWT token
 * @returns {string|null} The JWT token or null if not found
 */
export const getToken = () => {
  try {
    return localStorage.getItem(STORAGE_KEYS.TOKEN);
  } catch (error) {
    console.error("Error reading token from localStorage:", error);
    return null;
  }
};

/**
 * Stores the JWT token in localStorage
 * @param {string} token - The JWT token to store
 */
export const setToken = (token) => {
  try {
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
  } catch (error) {
    console.error("Error storing token in localStorage:", error);
  }
};

/**
 * Removes the JWT token from localStorage
 */
export const removeToken = () => {
  try {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
  } catch (error) {
    console.error("Error removing token from localStorage:", error);
  }
};

/**
 * Gets the stored user data
 * @returns {Object|null} The user data or null if not found
 */
export const getUser = () => {
  try {
    const userData = localStorage.getItem(STORAGE_KEYS.USER);
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error("Error reading user from localStorage:", error);
    return null;
  }
};

/**
 * Stores user data in localStorage
 * @param {Object} user - The user data to store
 */
export const setUser = (user) => {
  try {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  } catch (error) {
    console.error("Error storing user in localStorage:", error);
  }
};

/**
 * Removes user data from localStorage
 */
export const removeUser = () => {
  try {
    localStorage.removeItem(STORAGE_KEYS.USER);
  } catch (error) {
    console.error("Error removing user from localStorage:", error);
  }
};

/**
 * Gets the remember me preference
 * @returns {boolean} Whether remember me is enabled
 */
export const getRememberMe = () => {
  try {
    return localStorage.getItem(STORAGE_KEYS.REMEMBER_ME) === "true";
  } catch {
    return false;
  }
};

/**
 * Sets the remember me preference
 * @param {boolean} remember - Whether to remember the user
 */
export const setRememberMe = (remember) => {
  try {
    localStorage.setItem(STORAGE_KEYS.REMEMBER_ME, String(remember));
  } catch (error) {
    console.error("Error storing remember me preference:", error);
  }
};

/**
 * Clears all authentication data from localStorage
 */
export const clearAuthData = () => {
  removeToken();
  removeUser();
};

/**
 * Checks if there's a valid token stored
 * @returns {boolean} True if a token exists
 */
export const hasToken = () => {
  const token = getToken();
  return token !== null && token !== "";
};

/**
 * Parses a JWT token without validation (for reading claims)
 * @param {string} token - The JWT token to parse
 * @returns {Object|null} The decoded token payload or null if invalid
 */
export const parseToken = (token) => {
  if (!token) return null;

  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const payload = parts[1];
    const decoded = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(decoded);
  } catch (error) {
    console.error("Error parsing token:", error);
    return null;
  }
};

/**
 * Checks if the token is expired
 * @param {string} token - The JWT token to check
 * @returns {boolean} True if the token is expired
 */
export const isTokenExpired = (token) => {
  const parsed = parseToken(token);
  if (!parsed || !parsed.exp) return true;

  // exp is in seconds, Date.now() is in milliseconds
  const expirationTime = parsed.exp * 1000;
  const currentTime = Date.now();

  // Add a 60-second buffer to handle clock differences
  return currentTime >= expirationTime - 60000;
};

/**
 * Gets the time remaining until token expiration
 * @param {string} token - The JWT token
 * @returns {number} Time remaining in milliseconds, or 0 if expired
 */
export const getTokenTimeRemaining = (token) => {
  const parsed = parseToken(token);
  if (!parsed || !parsed.exp) return 0;

  const expirationTime = parsed.exp * 1000;
  const currentTime = Date.now();
  const remaining = expirationTime - currentTime;

  return Math.max(0, remaining);
};

/**
 * Checks if the stored token is valid and not expired
 * @returns {boolean} True if a valid, non-expired token exists
 */
export const isAuthenticated = () => {
  const token = getToken();
  if (!token) return false;

  return !isTokenExpired(token);
};

/**
 * Gets user ID from the stored token
 * @returns {string|null} The user ID or null
 */
export const getUserIdFromToken = () => {
  const token = getToken();
  if (!token) return null;

  const parsed = parseToken(token);
  return parsed?.sub || parsed?.userId || null;
};

/**
 * Gets user email from the stored token
 * @returns {string|null} The user email or null
 */
export const getEmailFromToken = () => {
  const token = getToken();
  if (!token) return null;

  const parsed = parseToken(token);
  return parsed?.email || parsed?.sub || null;
};
