import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const url = process.env.DB || "mongodb://localhost:27017/ELearningPlatform";
    const { connection } = await mongoose.connect(url);
    console.log(`Connected to MongoDB: ${connection.name}`);
  } catch (error) {
    console.log("MongoDB connection error:", error);
  }
};