import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Verify credentials are loaded
// if (
//   !process.env.CLOUDINARY_CLOUD_NAME ||
//   !process.env.CLOUDINARY_API_KEY ||
//   !process.env.CLOUDINARY_API_SECRET
// ) {
//   console.error("❌ Missing Cloudinary credentials in .env file");
//   console.log("CLOUDINARY_CLOUD_NAME:", process.env.CLOUDINARY_CLOUD_NAME);
//   console.log("CLOUDINARY_API_KEY:", process.env.CLOUDINARY_API_KEY);
//   console.log(
//     "CLOUDINARY_API_SECRET:",
//     process.env.CLOUDINARY_API_SECRET ? "Set" : "Missing"
//   );
// }

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) {
      console.log("⚠️ No file path provided to uploadOnCloudinary");
      return null;
    }

    // Check if file exists before uploading
    if (!fs.existsSync(localFilePath)) {
      console.error(`❌ File does not exist at path: ${localFilePath}`);
      return null;
    }

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
      folder: "user-uploads", // Optional: organize uploads in folders
    });

    console.log("Response from cloudinary: ", response);

    console.log("✅ File uploaded successfully:", response.url);

    // Delete file after successful upload
    fs.unlinkSync(localFilePath); // Use sync version for reliability
    console.log("🗑️ Local file deleted:", localFilePath);

    return response;
  } catch (error) {
    console.error("❌ Cloudinary upload error:", error.message);
    console.error("Error details:", error);

    // Cleanup local file on failure
    try {
      if (fs.existsSync(localFilePath)) {
        fs.unlinkSync(localFilePath);
        console.log("🗑️ Cleaned up local file after failed upload");
      }
    } catch (cleanupError) {
      console.error("Failed to cleanup local file:", cleanupError.message);
    }

    // Re-throw error instead of returning null for better error tracking
    throw new Error(`Cloudinary upload failed: ${error.message}`);
  }
};

export { uploadOnCloudinary };
