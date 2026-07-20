import mongoose from "mongoose";

const connectDB = async () => {
  try {
    if (process.env.DEMO_MODE === "true") {
      console.log("Demo mode enabled. Skipping MongoDB connection.");
      return;
    }

    const connectWithRetry = async () => {
      try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
          serverSelectionTimeoutMS: 5000,
        });

        console.log("MongoDB Connected:", conn.connection.host);

      } catch (err) {
        console.error("MongoDB Connection Error, retrying in 5 seconds...", err);

        setTimeout(connectWithRetry, 5000);
      }
    };

    mongoose.connection.on("disconnected", () => {
      console.log("MongoDB disconnected! Attempting to reconnect...");
    });

    mongoose.connection.on("reconnected", () => {
      console.log("MongoDB reconnected!");
    });

    await connectWithRetry();

  } catch (err) {
    console.error("MongoDB Fatal Error:", err);
    process.exit(1);
  }
};

export default connectDB;