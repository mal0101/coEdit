/**
 * constants.js
 *
 * Description: Application-wide constants including API URLs, WebSocket URLs,
 * access types, and other configuration values.
 *
 * Usage:
 *   import { API_BASE_URL, ACCESS_TYPES } from '../utils/constants';
 */

// API Configuration
export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8005";
export const WS_URL = import.meta.env.VITE_WS_URL || "http://localhost:8005/ws";

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: "/api/auth/login",
    SIGNUP: "/api/auth/signup",
    ME: "/api/auth/me",
  },
  // Documents
  DOCUMENTS: {
    BASE: "/api/docs",
    BY_ID: (id) => `/api/docs/${id}`,
    BY_OWNER: (ownerId) => `/api/docs/owner/${ownerId}`,
  },
  // Permissions
  PERMISSIONS: {
    GRANT: "/api/permissions/grant",
    REVOKE: (id) => `/api/permissions/${id}`,
    BY_USER: (userId) => `/api/permissions/user/${userId}`,
    BY_DOCUMENT: (docId) => `/api/permissions/doc/${docId}`,
  },
  // Comments
  COMMENTS: {
    BASE: "/api/comments",
    BY_ID: (id) => `/api/comments/${id}`,
    BY_DOCUMENT: (docId) => `/api/comments/doc/${docId}`,
  },
  // Version History
  HISTORY: {
    BASE: "/api/history",
    BY_ID: (id) => `/api/history/${id}`,
    BY_DOCUMENT: (docId) => `/api/history/document/${docId}`,
    RESTORE: (id) => `/api/history/${id}/restore`,
  },
  // Users
  USERS: {
    BASE: "/api/users",
    BY_EMAIL: (email) => `/api/users/email/${email}`,
  },
};

// WebSocket Topics
export const WS_TOPICS = {
  DOCUMENT_UPDATES: (docId) => `/topic/document/${docId}/updates`,
  DOCUMENT_CURSORS: (docId) => `/topic/document/${docId}/cursors`,
  DOCUMENT_PRESENCE: (docId) => `/topic/document/${docId}/presence`,
};

// WebSocket Destinations
export const WS_DESTINATIONS = {
  DOCUMENT_EDIT: (docId) => `/app/document/${docId}/edit`,
  DOCUMENT_CURSOR: (docId) => `/app/document/${docId}/cursor`,
  DOCUMENT_PRESENCE: (docId) => `/app/document/${docId}/presence`,
};

// Access Types
export const ACCESS_TYPES = {
  VIEWER: "VIEWER",
  EDITOR: "EDITOR",
  OWNER: "OWNER",
};

// Access Type Labels
export const ACCESS_TYPE_LABELS = {
  VIEWER: "Can View",
  EDITOR: "Can Edit",
  OWNER: "Owner",
};

// Operation Types for WebSocket
export const OPERATION_TYPES = {
  INSERT: "insert",
  DELETE: "delete",
  REPLACE: "replace",
};

// Presence Actions
export const PRESENCE_ACTIONS = {
  JOIN: "join",
  LEAVE: "leave",
};

// Local Storage Keys
export const STORAGE_KEYS = {
  TOKEN: "coedit_token",
  USER: "coedit_user",
  REMEMBER_ME: "coedit_remember_me",
  THEME: "coedit_theme",
};

// Route Paths
export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  DASHBOARD: "/dashboard",
  DOCUMENT: "/document",
  SHARED: "/shared",
  PROFILE: "/profile",
  NOT_FOUND: "*",
};

// Debounce Delays (in milliseconds)
export const DEBOUNCE_DELAYS = {
  AUTO_SAVE: 1000,
  SEARCH: 300,
  CURSOR_UPDATE: 50,
};

// Notification Types
export const NOTIFICATION_TYPES = {
  SUCCESS: "success",
  ERROR: "error",
  WARNING: "warning",
  INFO: "info",
};

// Notification Duration (in milliseconds)
export const NOTIFICATION_DURATION = 5000;

// User Colors for Collaboration
export const USER_COLORS = [
  "#ef4444", // red
  "#f97316", // orange
  "#eab308", // yellow
  "#22c55e", // green
  "#06b6d4", // cyan
  "#8b5cf6", // purple
  "#ec4899", // pink
  "#6366f1", // indigo
];

// Password Strength Levels
export const PASSWORD_STRENGTH = {
  WEAK: { level: 1, label: "Weak", color: "bg-red-500" },
  FAIR: { level: 2, label: "Fair", color: "bg-yellow-500" },
  GOOD: { level: 3, label: "Good", color: "bg-blue-500" },
  STRONG: { level: 4, label: "Strong", color: "bg-green-500" },
};

// Pagination (prepared for future use)
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
};

// Date Format Options
export const DATE_FORMAT_OPTIONS = {
  SHORT: { month: "short", day: "numeric", year: "numeric" },
  LONG: { weekday: "long", month: "long", day: "numeric", year: "numeric" },
  TIME: { hour: "2-digit", minute: "2-digit" },
  FULL: {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  },
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: "Network error. Please check your connection.",
  UNAUTHORIZED: "Your session has expired. Please login again.",
  FORBIDDEN: "You do not have permission to perform this action.",
  NOT_FOUND: "The requested resource was not found.",
  SERVER_ERROR: "An unexpected error occurred. Please try again later.",
  RATE_LIMITED: "Too many requests. Please wait and try again.",
  VALIDATION_ERROR: "Please check your input and try again.",
};

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN: "Welcome back!",
  REGISTER: "Account created successfully!",
  LOGOUT: "You have been logged out.",
  DOCUMENT_CREATED: "Document created successfully!",
  DOCUMENT_UPDATED: "Document saved successfully!",
  DOCUMENT_DELETED: "Document deleted successfully!",
  PERMISSION_GRANTED: "Permission granted successfully!",
  PERMISSION_REVOKED: "Permission revoked successfully!",
  COMMENT_ADDED: "Comment added successfully!",
  COMMENT_UPDATED: "Comment updated successfully!",
  COMMENT_DELETED: "Comment deleted successfully!",
  VERSION_RESTORED: "Document restored to previous version!",
};
