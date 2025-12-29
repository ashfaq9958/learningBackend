import { User } from "../models/user.model";
import { ApiError } from "../utils/ApiError";

// Find user by email or username
export const findUserByEmailOrUsername = async (email, username) => {
  const query = email
    ? { email: email.toLowerCase() }
    : { username: username.toLowerCase() };

  const user = await User.findOne(query).select("+password");

  return user;
};

// Generate access and refresh tokens for a user
export const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    // Generate tokens using methods from user model
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    // Save refresh token to database
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating tokens");
  }
};
