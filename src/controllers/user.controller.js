import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { validateRequiredFields } from "../validators/userValidators.js";
import { createUser, checkUserExists } from "../services/userService.js";
import { getFilePath, uploadUserImage } from "../utils/fileHandler.js";
import { ApiError } from "../utils/ApiError.js";
import {
  findUserByEmailOrUsername,
  generateAccessAndRefreshTokens,
} from "../services/authService.js";
import { User } from "../models/user.model.js";

const registerUser = asyncHandler(async (req, res) => {
  console.log("Request: ", req.body);

  const { fullname, email, password, username } = req.body;

  validateRequiredFields({ fullname, email, password, username });

  checkUserExists(username, email);

  console.log("ReqFilesFromMulter: ", req.files);

  const avatarPath = getFilePath(req.files, "avatar");
  const coverImagePath = getFilePath(req.files, "coverImage");

  const { avatarUrl, coverImageUrl } = await uploadUserImage(
    avatarPath,
    coverImagePath
  );

  // Create user - Mongoose schema will handle final validation
  const userData = {
    fullname: fullname.trim(),
    avatar: avatarUrl,
    coverImage: coverImageUrl,
    email: email.toLowerCase().trim(),
    password,
    username: username.toLowerCase().trim(),
  };

  const createdUser = await createUser(userData);

  console.log(createUser);

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!email && !username) {
    throw new ApiError(400, "Username or email is required");
  }

  if (!password) {
    throw new ApiError(400, "Password is required");
  }

  // Find user by email or username
  const user = await findUserByEmailOrUsername(email, username);

  if (!user) {
    throw new ApiError(401, "Invalid Credentials");
  }

  // Verify password
  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials");
  }

  // Generate tokens
  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  // Get user without sensitive data
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  // Cookie options
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  };

  console.log(`User logged in successfully: ${user._id}`);

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        "User logged in successfully"
      )
    );
});

export { registerUser, loginUser };
