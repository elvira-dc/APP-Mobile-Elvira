// Email validation
export const validateEmail = (email) => {
  if (!email || typeof email !== "string") {
    return { isValid: false, message: "Email is required" };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email.trim())) {
    return { isValid: false, message: "Please enter a valid email address" };
  }

  return { isValid: true, message: "" };
};

// Password validation
export const validatePassword = (password, options = {}) => {
  const {
    minLength = 8,
    requireUppercase = true,
    requireLowercase = true,
    requireNumbers = true,
    requireSpecialChars = false,
  } = options;

  if (!password || typeof password !== "string") {
    return { isValid: false, message: "Password is required" };
  }

  if (password.length < minLength) {
    return {
      isValid: false,
      message: `Password must be at least ${minLength} characters long`,
    };
  }

  if (requireUppercase && !/[A-Z]/.test(password)) {
    return {
      isValid: false,
      message: "Password must contain at least one uppercase letter",
    };
  }

  if (requireLowercase && !/[a-z]/.test(password)) {
    return {
      isValid: false,
      message: "Password must contain at least one lowercase letter",
    };
  }

  if (requireNumbers && !/\d/.test(password)) {
    return {
      isValid: false,
      message: "Password must contain at least one number",
    };
  }

  if (requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return {
      isValid: false,
      message: "Password must contain at least one special character",
    };
  }

  return { isValid: true, message: "" };
};

// Phone number validation
export const validatePhone = (phone) => {
  if (!phone || typeof phone !== "string") {
    return { isValid: false, message: "Phone number is required" };
  }

  // Remove all non-digit characters
  const digitsOnly = phone.replace(/\D/g, "");

  // Check if it's a valid length (10-15 digits)
  if (digitsOnly.length < 10 || digitsOnly.length > 15) {
    return {
      isValid: false,
      message: "Phone number must be between 10 and 15 digits",
    };
  }

  return { isValid: true, message: "" };
};

// Required field validation
export const validateRequired = (value, fieldName = "This field") => {
  if (!value || (typeof value === "string" && value.trim() === "")) {
    return { isValid: false, message: `${fieldName} is required` };
  }

  return { isValid: true, message: "" };
};

// Minimum length validation
export const validateMinLength = (
  value,
  minLength,
  fieldName = "This field"
) => {
  if (!value || typeof value !== "string") {
    return { isValid: false, message: `${fieldName} is required` };
  }

  if (value.length < minLength) {
    return {
      isValid: false,
      message: `${fieldName} must be at least ${minLength} characters long`,
    };
  }

  return { isValid: true, message: "" };
};

// Maximum length validation
export const validateMaxLength = (
  value,
  maxLength,
  fieldName = "This field"
) => {
  if (!value || typeof value !== "string") {
    return { isValid: true, message: "" };
  }

  if (value.length > maxLength) {
    return {
      isValid: false,
      message: `${fieldName} must not exceed ${maxLength} characters`,
    };
  }

  return { isValid: true, message: "" };
};

// Number validation
export const validateNumber = (value, options = {}) => {
  const { min, max, integer = false } = options;
  const fieldName = options.fieldName || "This field";

  if (value === null || value === undefined || value === "") {
    return { isValid: false, message: `${fieldName} is required` };
  }

  const numValue = Number(value);

  if (isNaN(numValue)) {
    return { isValid: false, message: `${fieldName} must be a valid number` };
  }

  if (integer && !Number.isInteger(numValue)) {
    return { isValid: false, message: `${fieldName} must be a whole number` };
  }

  if (min !== undefined && numValue < min) {
    return {
      isValid: false,
      message: `${fieldName} must be at least ${min}`,
    };
  }

  if (max !== undefined && numValue > max) {
    return {
      isValid: false,
      message: `${fieldName} must not exceed ${max}`,
    };
  }

  return { isValid: true, message: "" };
};

// Date validation
export const validateDate = (date, options = {}) => {
  const {
    minDate,
    maxDate,
    futureOnly = false,
    pastOnly = false,
    fieldName = "Date",
  } = options;

  if (!date) {
    return { isValid: false, message: `${fieldName} is required` };
  }

  const dateObj = new Date(date);

  if (isNaN(dateObj.getTime())) {
    return { isValid: false, message: `${fieldName} is not a valid date` };
  }

  const now = new Date();
  now.setHours(0, 0, 0, 0); // Reset time to start of day for comparison

  if (futureOnly && dateObj <= now) {
    return {
      isValid: false,
      message: `${fieldName} must be in the future`,
    };
  }

  if (pastOnly && dateObj >= now) {
    return {
      isValid: false,
      message: `${fieldName} must be in the past`,
    };
  }

  if (minDate && dateObj < new Date(minDate)) {
    return {
      isValid: false,
      message: `${fieldName} must be after ${new Date(
        minDate
      ).toLocaleDateString()}`,
    };
  }

  if (maxDate && dateObj > new Date(maxDate)) {
    return {
      isValid: false,
      message: `${fieldName} must be before ${new Date(
        maxDate
      ).toLocaleDateString()}`,
    };
  }

  return { isValid: true, message: "" };
};

// URL validation
export const validateUrl = (url) => {
  if (!url || typeof url !== "string") {
    return { isValid: false, message: "URL is required" };
  }

  try {
    new URL(url);
    return { isValid: true, message: "" };
  } catch {
    return { isValid: false, message: "Please enter a valid URL" };
  }
};

// Form validation helper
export const validateForm = (formData, validationRules) => {
  const errors = {};
  let isValid = true;

  Object.keys(validationRules).forEach((fieldName) => {
    const rules = validationRules[fieldName];
    const value = formData[fieldName];

    for (let rule of rules) {
      const result = rule(value);

      if (!result.isValid) {
        errors[fieldName] = result.message;
        isValid = false;
        break; // Stop at first validation error for this field
      }
    }
  });

  return { isValid, errors };
};

// Common validation rule builders
export const required =
  (fieldName = "This field") =>
  (value) =>
    validateRequired(value, fieldName);

export const email = () => (value) => validateEmail(value);

export const password =
  (options = {}) =>
  (value) =>
    validatePassword(value, options);

export const phone = () => (value) => validatePhone(value);

export const minLength =
  (length, fieldName = "This field") =>
  (value) =>
    validateMinLength(value, length, fieldName);

export const maxLength =
  (length, fieldName = "This field") =>
  (value) =>
    validateMaxLength(value, length, fieldName);

export const number =
  (options = {}) =>
  (value) =>
    validateNumber(value, options);

export const date =
  (options = {}) =>
  (value) =>
    validateDate(value, options);

export const url = () => (value) => validateUrl(value);

// Example usage:
// const validationRules = {
//   email: [required('Email'), email()],
//   password: [required('Password'), password({ minLength: 8 })],
//   name: [required('Name'), minLength(2, 'Name')],
//   age: [required('Age'), number({ min: 18, max: 120, integer: true })],
// };
//
// const { isValid, errors } = validateForm(formData, validationRules);
