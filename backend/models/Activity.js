const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  description: String,
  price: {
    type: Number,
    required: true
  },
  slotsAvailable: {
    type: Number,
    default: 0
  },
  duration: {
    type: String
  },
  wellnessLevel: {
    type: String,
    enum: ["Relaxing", "High Energy", "Meditative", "Other"],
    default: "Other"
  },
  available: {
    type: Boolean,
    default: true
  },
  image: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Activity", activitySchema);
