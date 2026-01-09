/**
 * Validates an email address format
 * @param {string} email - The email address to validate
 * @returns {{ isValid: boolean, message: string }} Validation result
 */
export const validateEmail = (email) => {
  if (!email) {
    return { isValid: false, message: "Email is required" };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, message: "Please enter a valid email address" };
  }

  return { isValid: true, message: "" };
};

/**
 * Validates password strength and requirements
 * @param {string} password - The password to validate
 * @returns {{ isValid: boolean, message: string, strength: number }} Validation result with strength score (0-4)
 */
export const validatePassword = (password) => {
  if (!password) {
    return { isValid: false, message: "Password is required", strength: 0 };
  }

  if (password.length < 8) {
    return {
      isValid: false,
      message: "Password must be at least 8 characters",
      strength: 1,
    };
  }

  let strength = 0;

  // Length check
  if (password.length >= 8) strength++;
  if (password.length >= 12) strength++;

  // Character type checks
  if (/[a-z]/.test(password)) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^a-zA-Z0-9]/.test(password)) strength++;

  // Normalize to 1-4 scale
  const normalizedStrength = Math.min(4, Math.ceil(strength / 1.5));

  return { isValid: true, message: "", strength: normalizedStrength };
};

/**
 * Validates password confirmation match
 * @param {string} password - The original password
 * @param {string} confirmPassword - The confirmation password
 * @returns {{ isValid: boolean, message: string }} Validation result
 */
export const validatePasswordMatch = (password, confirmPassword) => {
  if (!confirmPassword) {
    return { isValid: false, message: "Please confirm your password" };
  }

  if (password !== confirmPassword) {
    return { isValid: false, message: "Passwords do not match" };
  }

  return { isValid: true, message: "" };
};

/**
 * Validates a user's name
 * @param {string} name - The name to validate
 * @returns {{ isValid: boolean, message: string }} Validation result
 */
export const validateName = (name) => {
  if (!name) {
    return { isValid: false, message: "Name is required" };
  }

  if (name.trim().length < 2) {
    return { isValid: false, message: "Name must be at least 2 characters" };
  }

  if (name.length > 100) {
    return { isValid: false, message: "Name must be less than 100 characters" };
  }

  return { isValid: true, message: "" };
};

/**
 * Validates a document title
 * @param {string} title - The title to validate
 * @returns {{ isValid: boolean, message: string }} Validation result
 */
export const validateDocumentTitle = (title) => {
  if (!title) {
    return { isValid: false, message: "Title is required" };
  }

  if (title.trim().length < 1) {
    return { isValid: false, message: "Title cannot be empty" };
  }

  if (title.length > 255) {
    return {
      isValid: false,
      message: "Title must be less than 255 characters",
    };
  }

  return { isValid: true, message: "" };
};

/**
 * Validates a comment body
 * @param {string} body - The comment body to validate
 * @returns {{ isValid: boolean, message: string }} Validation result
 */
export const validateComment = (body) => {
  if (!body) {
    return { isValid: false, message: "Comment cannot be empty" };
  }

  if (body.trim().length < 1) {
    return { isValid: false, message: "Comment cannot be empty" };
  }

  if (body.length > 5000) {
    return {
      isValid: false,
      message: "Comment must be less than 5000 characters",
    };
  }

  return { isValid: true, message: "" };
};

/**
 * Validates a complete login form
 * @param {{ email: string, password: string }} formData - The form data
 * @returns {{ isValid: boolean, errors: Object }} Validation result with field-specific errors
 */
export const validateLoginForm = (formData) => {
  const errors = {};

  const emailValidation = validateEmail(formData.email);
  if (!emailValidation.isValid) {
    errors.email = emailValidation.message;
  }

  if (!formData.password) {
    errors.password = "Password is required";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validates a complete registration form
 * @param {{ email: string, name: string, password: string, confirmPassword: string }} formData - The form data
 * @returns {{ isValid: boolean, errors: Object }} Validation result with field-specific errors
 */
export const validateRegisterForm = (formData) => {
  const errors = {};

  const emailValidation = validateEmail(formData.email);
  if (!emailValidation.isValid) {
    errors.email = emailValidation.message;
  }

  const nameValidation = validateName(formData.name);
  if (!nameValidation.isValid) {
    errors.name = nameValidation.message;
  }

  const passwordValidation = validatePassword(formData.password);
  if (!passwordValidation.isValid) {
    errors.password = passwordValidation.message;
  }

  const passwordMatchValidation = validatePasswordMatch(
    formData.password,
    formData.confirmPassword
  );
  if (!passwordMatchValidation.isValid) {
    errors.confirmPassword = passwordMatchValidation.message;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Sanitizes user input by removing potentially harmful characters
 * @param {string} input - The input to sanitize
 * @returns {string} Sanitized input
 */
export const sanitizeInput = (input) => {
  if (!input) return "";

  return input
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
};

/**
 * Checks if a string contains only whitespace
 * @param {string} str - The string to check
 * @returns {boolean} True if string is empty or only whitespace
 */
export const isEmptyOrWhitespace = (str) => {
  return !str || str.trim().length === 0;
};

/**
 * Validates URL format
 * @param {string} url - The URL to validate
 * @returns {{ isValid: boolean, message: string }} Validation result
 */
export const validateUrl = (url) => {
  if (!url) {
    return { isValid: false, message: "URL is required" };
  }

  try {
    new URL(url);
    return { isValid: true, message: "" };
  } catch {
    return { isValid: false, message: "Please enter a valid URL" };
  }
};
