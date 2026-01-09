import axios from "axios";
import { API_BASE_URL, ERROR_MESSAGES } from "../utils/constants";
import { getToken, clearAuthData } from "../utils/tokenManager";

/**
 * Axios instance configured with base URL and default headers
 */
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, // 30 seconds timeout
});

/**
 * Request interceptor to add authentication token to all requests
 * Skips adding token for auth endpoints (login, register)
 */
api.interceptors.request.use(
  (config) => {
    // Skip token for auth endpoints
    const isAuthEndpoint = config.url?.includes("/auth/");

    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else if (!isAuthEndpoint) {
      console.warn("No auth token found for request:", config.url);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor to handle errors globally
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle network errors
    if (!error.response) {
      error.message = ERROR_MESSAGES.NETWORK_ERROR;
      return Promise.reject(error);
    }

    const { status } = error.response;

    switch (status) {
      case 401:
        // Unauthorized - clear auth data and redirect to login
        clearAuthData();
        // Only redirect if not already on auth pages
        if (
          !window.location.pathname.includes("/login") &&
          !window.location.pathname.includes("/register")
        ) {
          window.location.href = "/login";
        }
        error.message = ERROR_MESSAGES.UNAUTHORIZED;
        break;

      case 403:
        error.message = ERROR_MESSAGES.FORBIDDEN;
        break;

      case 404:
        error.message = ERROR_MESSAGES.NOT_FOUND;
        break;

      case 429:
        error.message = ERROR_MESSAGES.RATE_LIMITED;
        break;

      case 500:
      case 502:
      case 503:
      case 504:
        error.message = ERROR_MESSAGES.SERVER_ERROR;
        break;

      default:
        // Use server-provided message if available
        error.message =
          error.response?.data?.message || ERROR_MESSAGES.SERVER_ERROR;
    }

    return Promise.reject(error);
  }
);

export default api;
