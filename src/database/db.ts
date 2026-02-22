import mongoose from "mongoose";
import { envService } from "../config/env";

export const connectDatabase = async () => {
  try {
    await mongoose.connect(envService.get("DATABASE_URL")!);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

export const disconnectDatabase = async () => {
  try {
    await mongoose.disconnect();
  } catch (error) {
    console.error("MongoDB disconnection error:", error);
  }
};
