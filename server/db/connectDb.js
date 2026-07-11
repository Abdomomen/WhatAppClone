// db.js
import dotenv from "dotenv"
dotenv.config()
import mongoose from "mongoose";
export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Database connection error: ${error.message}`);
    process.exit(1); // Stop the server if the connection fails
  }
};

