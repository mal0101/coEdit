import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import PropTypes from "prop-types";
import authService from "../services/authService";
import {
  getToken,
  getUser,
  setUser,
  clearAuthData,
  isAuthenticated as checkAuth,
} from "../utils/tokenManager";

const AuthContext = createContext(null);

/**
 * Authentication provider component
 * @param {Object} props - Component props
 * @param {ReactNode} props.children - Child components
 */
export function AuthProvider({ children }) {
  const [user, setUserState] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Initializes authentication state on mount
   */
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (checkAuth()) {
          // Try to get user from localStorage first
          const storedUser = getUser();
          if (storedUser) {
            setUserState(storedUser);
          }

          // Verify token and get fresh user data
          const token = getToken();
          if (token) {
            const userData = await authService.getCurrentUser();
            setUserState(userData);
            setUser(userData);
          }
        }
      } catch (err) {
        console.error("Auth initialization error:", err);
        clearAuthData();
        setUserState(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  /**
   * Handles user login
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} Login response
   */
  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);

    try {
      const response = await authService.login(email, password);

      // Get user data after login
      const userData = await authService.getCurrentUser();
      setUserState(userData);

      return response;
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Login failed");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Handles user registration
   * @param {string} email - User email
   * @param {string} name - User name
   * @param {string} password - User password
   * @returns {Promise<Object>} Registration response
   */
  const register = useCallback(async (email, name, password) => {
    setLoading(true);
    setError(null);

    try {
      const response = await authService.register(email, name, password);
      return response;
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Registration failed"
      );
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Handles user logout
   */
  const logout = useCallback(() => {
    authService.logout();
    setUserState(null);
    setError(null);
  }, []);

  /**
   * Refreshes user data from the server
   */
  const refreshUser = useCallback(async () => {
    if (!checkAuth()) return;

    try {
      const userData = await authService.getCurrentUser();
      setUserState(userData);
      setUser(userData);
    } catch (err) {
      console.error("Error refreshing user:", err);
    }
  }, []);

  /**
   * Clears any authentication errors
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user && checkAuth(),
    login,
    register,
    logout,
    refreshUser,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

/**
 * Custom hook to access authentication context
 * @returns {Object} Auth context value
 * @throws {Error} If used outside AuthProvider
 */
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}

export default AuthContext;
