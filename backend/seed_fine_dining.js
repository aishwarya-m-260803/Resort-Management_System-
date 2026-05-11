/**
 * Seed Script: Insert 'Fine Dining' activity into the database.
 * Run once:  node seed_fine_dining.js
 */
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Activity = require("./models/Activity");

dotenv.config();

const seedFineDining = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Check if Fine Dining already exists
    const existing = await Activity.findOne({ name: "Fine Dining" });
    if (existing) {
      console.log("⚠️  'Fine Dining' activity already exists. Skipping insert.");
      await mongoose.disconnect();
      return;
    }

    const fineDining = new Activity({
      name: "Fine Dining",
      category: "Fine Dining",
      description:
        "A world-class gastronomic journey featuring local and international flavors",
      price: 4500,
      slotsAvailable: 20,
      duration: "120 Mins",
      wellnessLevel: "Other",
      available: true,
      image: "/uploads/activities/dining.jpg",
    });

    await fineDining.save();
    console.log("✅ 'Fine Dining' activity inserted successfully!");
    console.log("   Price: ₹4,500 | Category: Fine Dining | Capacity: 20");

    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
  } catch (error) {
    console.error("❌ Seed failed:", error.message);
    process.exit(1);
  }
};

seedFineDining();
