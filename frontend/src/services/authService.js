import api from "./api";
import { API_ENDPOINTS } from "../utils/constants";
import { setToken, setUser, clearAuthData } from "../utils/tokenManager";

const authService = {
  /**
   * Registers a new user account
   * @param {string} email - User's email address
   * @param {string} name - User's display name
   * @param {string} password - User's password
   * @returns {Promise<Object>} API response with user data
   */
  async register(email, name, password) {
    const response = await api.post(API_ENDPOINTS.AUTH.SIGNUP, {
      email,
      name,
      password,
    });
    return response.data;
  },

  /**
   * Authenticates a user and stores the JWT token
   * @param {string} email - User's email address
   * @param {string} password - User's password
   * @returns {Promise<Object>} API response with token and user data
   */
  async login(email, password) {
    const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, {
      email,
      password,
    });

    const { token, ...userData } = response.data;

    if (token) {
      setToken(token);
      // Store user data if available
      if (userData.user) {
        setUser(userData.user);
      } else if (userData.id || userData.email) {
        setUser(userData);
      }
    }

    return response.data;
  },

  /**
   * Logs out the current user by clearing stored auth data
   */
  logout() {
    clearAuthData();
  },

  /**
   * Retrieves the current authenticated user's information
   * @returns {Promise<Object>} User data
   */
  async getCurrentUser() {
    const response = await api.get(API_ENDPOINTS.AUTH.ME);
    const userData = response.data;

    // Update stored user data
    if (userData) {
      setUser(userData);
    }

    return userData;
  },

  /**
   * Verifies if the current token is valid
   * @returns {Promise<boolean>} True if token is valid
   */
  async verifyToken() {
    try {
      await this.getCurrentUser();
      return true;
    } catch {
      clearAuthData();
      return false;
    }
  },

  /**
   * Updates user password (if endpoint exists)
   * @param {string} currentPassword - Current password
   * @param {string} newPassword - New password
   * @returns {Promise<Object>} API response
   */
  async changePassword(currentPassword, newPassword) {
    const response = await api.post("/api/auth/change-password", {
      currentPassword,
      newPassword,
    });
    return response.data;
  },
};

export default authService;
