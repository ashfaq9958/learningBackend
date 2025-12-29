import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";

// Checks if user already exists

export const checkUserExists = async (username, email) => {
  // Add input validation to prevent errors
  if (!username || !email) {
    throw new ApiError(400, "Username and email are required");
  }

  const existingUser = await User.findOne({
    $or: [{ username: username.toLowerCase() }, { email: email.toLowerCase() }],
  });

  if (existingUser) {
    const field =
      existingUser.email === email.toLowerCase() ? "email" : "username";
    throw new ApiError(409, `User with this ${field} already exists`);
  }
};

//   Creates a new user in the database

export const createUser = async (userData) => {
  const user = await User.create(userData);

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Failed to create user account");
  }

  return createdUser;
};

/**
 * Find user by email
 */
export const findUserByEmail = async (email) => {
  return await User.findOne({ email: email.toLowerCase() });
};

/**
 * Find user by username
 */
export const findUserByUsername = async (username) => {
  return await User.findOne({ username: username.toLowerCase() });
};
