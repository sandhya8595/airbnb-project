// ===== MongoDB Connection =====
// This file connects our Express server to MongoDB using Mongoose.
// It reads the connection string from the .env file.

const mongoose = require("mongoose");

async function connectDB() {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/airbnb';
    if (!process.env.MONGO_URI) {
      console.warn('⚠️ MONGO_URI not provided. Falling back to default local MongoDB URI.');
    }
    await mongoose.connect(mongoUri);
    console.log("✅ MongoDB connected successfully!");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  }
}

module.exports = connectDB;
