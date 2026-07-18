import mongoose from "mongoose";

const connectDB = async () => {
  try {
    if (process.env.DEMO_MODE === "true") {
      console.log("Demo mode enabled. Skipping MongoDB connection.");
      return;
    }

    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB Connected:", conn.connection.host);
  } catch (err) {
    console.error("MongoDB Connection Error:", err);
    process.exit(1);
  }
};

export default connectDB;