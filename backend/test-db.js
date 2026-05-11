const mongoose = require("mongoose");
require("dotenv").config();

console.log("Testing MongoDB Connection...");
console.log("MONGO_URI:", process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected successfully!");
    console.log("Database URL:", process.env.MONGO_URI);
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  });
