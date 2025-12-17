import dotenv from "dotenv";
// import connectDB from "./db/connectDB";
import connectDB from "./db/connectDB.js";

dotenv.config(); // 👈 FIRST thing

connectDB();
