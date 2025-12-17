import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined in environment variables");
    }

    const connectionInstance = await mongoose.connect(
      `${process.env.MONGO_URI}/${DB_NAME}`
    );

    console.log(
      `✅ MongoDB connected successfully: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1); // crash app if DB fails
  }
};

export default connectDB;
