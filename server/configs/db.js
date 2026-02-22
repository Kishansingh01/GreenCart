import mongoose from "mongoose";
import "dotenv/config";

const connectDB = async () => {
  try {
    console.log("Mongo URI:", process.env.MONGODB_URI);

    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is missing");
    }

    await mongoose.connect(process.env.MONGODB_URI);

    console.log("✅ MongoDB Atlas connected");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;
