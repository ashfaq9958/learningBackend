import { ApiError } from "../utils/ApiError.js";

// Validates required fields in the request body

export const validateRequiredFields = (fields) => {
  const emptyFields = Object.entries(fields)
    .filter(([_, value]) => !value || value.trim() === "")
    .map(([key]) => key);

  if (emptyFields.length > 0) {
    throw new ApiError(
      400,
      `Missing required fields: ${emptyFields.join(", ")}`
    );
  }
};


/**
 * Optional: Additional password strength validation
 * Only use if you want stricter rules than schema (e.g., special characters)
 */
export const validatePasswordStrength = (password) => {
  // Your schema already checks minlength: 6
  // Add this only if you want additional requirements
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);

  if (!hasUpperCase || !hasLowerCase || !hasNumber) {
    throw new ApiError(
      400,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    );
  }
};