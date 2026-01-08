/**
 * NotificationContext.jsx
 *
 * Description: Global notification/toast context provider for displaying
 * success, error, warning, and info messages throughout the application.
 *
 * Props:
 *   - children (ReactNode): Child components to wrap
 *
 * Usage:
 *   <NotificationProvider><App /></NotificationProvider>
 *   const { showNotification, showSuccess, showError } = useNotification();
 */

import { createContext, useContext, useState, useCallback } from "react";
import PropTypes from "prop-types";
import { NOTIFICATION_TYPES, NOTIFICATION_DURATION } from "../utils/constants";

/**
 * Notification context
 */
const NotificationContext = createContext(null);

/**
 * Generates a unique ID for notifications
 * @returns {string} Unique ID
 */
const generateId = () =>
  `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

/**
 * Notification provider component
 * @param {Object} props - Component props
 * @param {ReactNode} props.children - Child components
 */
export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);

  /**
   * Removes a notification by ID
   * @param {string} id - Notification ID
   */
  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  /**
   * Shows a notification
   * @param {string} type - Notification type (success, error, warning, info)
   * @param {string} message - Notification message
   * @param {number} duration - Duration in milliseconds (0 for permanent)
   * @returns {string} Notification ID
   */
  const showNotification = useCallback(
    (type, message, duration = NOTIFICATION_DURATION) => {
      const id = generateId();

      const notification = {
        id,
        type,
        message,
        timestamp: Date.now(),
      };

      setNotifications((prev) => [...prev, notification]);

      // Auto-remove after duration (if duration > 0)
      if (duration > 0) {
        setTimeout(() => {
          removeNotification(id);
        }, duration);
      }

      return id;
    },
    [removeNotification]
  );

  /**
   * Shows a success notification
   * @param {string} message - Success message
   * @param {number} duration - Duration in milliseconds
   * @returns {string} Notification ID
   */
  const showSuccess = useCallback(
    (message, duration) => {
      return showNotification(NOTIFICATION_TYPES.SUCCESS, message, duration);
    },
    [showNotification]
  );

  /**
   * Shows an error notification
   * @param {string} message - Error message
   * @param {number} duration - Duration in milliseconds
   * @returns {string} Notification ID
   */
  const showError = useCallback(
    (message, duration) => {
      return showNotification(NOTIFICATION_TYPES.ERROR, message, duration);
    },
    [showNotification]
  );

  /**
   * Shows a warning notification
   * @param {string} message - Warning message
   * @param {number} duration - Duration in milliseconds
   * @returns {string} Notification ID
   */
  const showWarning = useCallback(
    (message, duration) => {
      return showNotification(NOTIFICATION_TYPES.WARNING, message, duration);
    },
    [showNotification]
  );

  /**
   * Shows an info notification
   * @param {string} message - Info message
   * @param {number} duration - Duration in milliseconds
   * @returns {string} Notification ID
   */
  const showInfo = useCallback(
    (message, duration) => {
      return showNotification(NOTIFICATION_TYPES.INFO, message, duration);
    },
    [showNotification]
  );

  /**
   * Clears all notifications
   */
  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const value = {
    notifications,
    showNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    removeNotification,
    clearAll,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

NotificationProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

/**
 * Custom hook to access notification context
 * @returns {Object} Notification context value
 * @throws {Error} If used outside NotificationProvider
 */
export function useNotification() {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }

  return context;
}

export default NotificationContext;
