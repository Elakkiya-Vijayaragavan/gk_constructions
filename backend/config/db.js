const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed:");
    console.error(error.message);
    console.error("If you are using MongoDB Atlas, add your current IP address in Network Access.");
    process.exit(1);
  }
};

module.exports = connectDB;
