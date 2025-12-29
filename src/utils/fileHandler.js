import { ApiError } from "./ApiError.js";
import { uploadOnCloudinary } from "./cloudinary.js";

// Extracts file path from multer request

export const getFilePath = (files, fieldName) => {
  return files?.[fieldName]?.[0]?.path;
};

// Uploads images to cloudinary

export const uploadUserImage = async (avatarPath, coverImagePath) => {
  console.log("avatarPath: ", avatarPath)
  console.log("coverImagePath: ", coverImagePath)
  if (!avatarPath) {
    throw new ApiError(400, "Avatar image is required");
  }

  const [avatar, coverImage] = await Promise.all([
    uploadOnCloudinary(avatarPath),
    coverImagePath ? uploadOnCloudinary(coverImagePath) : Promise.resolve(null),
  ]);

  if (!avatar?.url) {
    throw new ApiError(500, "Failed to upload avatar image");
  }

  return {
    avatarUrl: avatar.url,
    coverImageUrl: coverImage?.url || "",
  };
};
