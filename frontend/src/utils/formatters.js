/**
 * formatters.js
 *
 * Description: Utility functions for formatting dates, text, numbers,
 * and other data for display in the UI.
 *
 * Usage:
 *   import { formatDate, formatRelativeTime } from '../utils/formatters';
 */

import { DATE_FORMAT_OPTIONS } from "./constants";

/**
 * Formats a date string or timestamp to a readable format
 * @param {string|Date|number} date - The date to format
 * @param {string} format - Format type: 'short', 'long', 'time', 'full'
 * @returns {string} Formatted date string
 */
export const formatDate = (date, format = "short") => {
  if (!date) return "";

  const dateObj = new Date(date);

  if (isNaN(dateObj.getTime())) {
    return "";
  }

  const options =
    DATE_FORMAT_OPTIONS[format.toUpperCase()] || DATE_FORMAT_OPTIONS.SHORT;

  return dateObj.toLocaleDateString("en-US", options);
};

/**
 * Formats a date to include time
 * @param {string|Date|number} date - The date to format
 * @returns {string} Formatted date and time string
 */
export const formatDateTime = (date) => {
  if (!date) return "";

  const dateObj = new Date(date);

  if (isNaN(dateObj.getTime())) {
    return "";
  }

  return dateObj.toLocaleString("en-US", DATE_FORMAT_OPTIONS.FULL);
};

/**
 * Formats a date to a relative time string (e.g., "2 hours ago")
 * @param {string|Date|number} date - The date to format
 * @returns {string} Relative time string
 */
export const formatRelativeTime = (date) => {
  if (!date) return "";

  const dateObj = new Date(date);

  if (isNaN(dateObj.getTime())) {
    return "";
  }

  const now = new Date();
  const diffInSeconds = Math.floor((now - dateObj) / 1000);

  if (diffInSeconds < 0) {
    return "just now";
  }

  if (diffInSeconds < 60) {
    return "just now";
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} ${diffInMinutes === 1 ? "minute" : "minutes"} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} ${diffInHours === 1 ? "hour" : "hours"} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} ${diffInDays === 1 ? "day" : "days"} ago`;
  }

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `${diffInWeeks} ${diffInWeeks === 1 ? "week" : "weeks"} ago`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} ${diffInMonths === 1 ? "month" : "months"} ago`;
  }

  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears} ${diffInYears === 1 ? "year" : "years"} ago`;
};

/**
 * Truncates text to a specified length with ellipsis
 * @param {string} text - The text to truncate
 * @param {number} maxLength - Maximum length before truncation
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text) return "";

  if (text.length <= maxLength) {
    return text;
  }

  return text.substring(0, maxLength).trim() + "...";
};

/**
 * Formats a number with thousand separators
 * @param {number} num - The number to format
 * @returns {string} Formatted number string
 */
export const formatNumber = (num) => {
  if (num === null || num === undefined) return "0";

  return new Intl.NumberFormat("en-US").format(num);
};

/**
 * Formats file size in bytes to human-readable format
 * @param {number} bytes - The file size in bytes
 * @returns {string} Formatted file size string
 */
export const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

/**
 * Counts words in a text string
 * @param {string} text - The text to count words in
 * @returns {number} Word count
 */
export const countWords = (text) => {
  if (!text) return 0;

  const trimmed = text.trim();
  if (trimmed.length === 0) return 0;

  return trimmed.split(/\s+/).length;
};

/**
 * Counts characters in a text string (excluding or including spaces)
 * @param {string} text - The text to count characters in
 * @param {boolean} includeSpaces - Whether to include spaces in the count
 * @returns {number} Character count
 */
export const countCharacters = (text, includeSpaces = true) => {
  if (!text) return 0;

  if (includeSpaces) {
    return text.length;
  }

  return text.replace(/\s/g, "").length;
};

/**
 * Capitalizes the first letter of a string
 * @param {string} str - The string to capitalize
 * @returns {string} Capitalized string
 */
export const capitalizeFirst = (str) => {
  if (!str) return "";

  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Converts a string to title case
 * @param {string} str - The string to convert
 * @returns {string} Title cased string
 */
export const toTitleCase = (str) => {
  if (!str) return "";

  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

/**
 * Gets initials from a name
 * @param {string} name - The name to get initials from
 * @returns {string} Initials (max 2 characters)
 */
export const getInitials = (name) => {
  if (!name) return "";

  const words = name.trim().split(/\s+/);

  if (words.length === 1) {
    return words[0].substring(0, 2).toUpperCase();
  }

  return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
};

/**
 * Formats an access type enum to a readable label
 * @param {string} accessType - The access type (VIEWER, EDITOR, OWNER)
 * @returns {string} Human-readable label
 */
export const formatAccessType = (accessType) => {
  const labels = {
    VIEWER: "Can View",
    EDITOR: "Can Edit",
    OWNER: "Owner",
  };

  return labels[accessType] || accessType;
};

/**
 * Generates a random color from predefined palette
 * @param {string|number} seed - Optional seed for consistent color generation
 * @returns {string} Hex color code
 */
export const generateUserColor = (seed) => {
  const colors = [
    "#ef4444",
    "#f97316",
    "#eab308",
    "#22c55e",
    "#06b6d4",
    "#8b5cf6",
    "#ec4899",
    "#6366f1",
  ];

  if (seed !== undefined) {
    // Generate consistent color based on seed
    const index =
      typeof seed === "string"
        ? seed.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) %
          colors.length
        : seed % colors.length;
    return colors[index];
  }

  return colors[Math.floor(Math.random() * colors.length)];
};

/**
 * Formats error message from API response
 * @param {Error|Object} error - The error object
 * @returns {string} User-friendly error message
 */
export const formatErrorMessage = (error) => {
  if (!error) return "An unexpected error occurred";

  // Check for API response error
  if (error.response?.data?.message) {
    return error.response.data.message;
  }

  // Check for standard error message
  if (error.message) {
    return error.message;
  }

  return "An unexpected error occurred";
};

/**
 * Formats document content preview
 * @param {string} content - The document content
 * @param {number} maxLength - Maximum length for preview
 * @returns {string} Content preview
 */
export const formatContentPreview = (content, maxLength = 150) => {
  if (!content) return "No content";

  const stripped = content.replace(/\n+/g, " ").trim();

  return truncateText(stripped, maxLength);
};

/**
 * Generates a unique session ID
 * @returns {string} Unique session ID
 */
export const generateSessionId = () => {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
};
