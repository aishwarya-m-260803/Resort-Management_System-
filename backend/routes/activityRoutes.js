const express = require("express");
const multer = require("multer");
const path = require("path");
const Activity = require("../models/Activity");

const router = express.Router();

// Multer Config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

router.get("/", async (req, res) => {
  try {
    const activities = await Activity.find();
    res.json(activities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ADD ACTIVITY (Admin)
router.post("/add", upload.single("image"), async (req, res) => {
  try {
    const { name, category, price, slotsAvailable, duration } = req.body;

    // Backend validation
    const errors = [];
    if (!name || !name.trim()) errors.push("Activity name is required");
    if (!category) errors.push("Category is required");
    if (price === undefined || price === '' || Number(price) < 0) errors.push("Price must be 0 or greater");
    if (!slotsAvailable || Number(slotsAvailable) < 1) errors.push("Slots must be at least 1");
    if (!duration || !duration.trim()) errors.push("Duration is required");
    if (errors.length > 0) {
      return res.status(400).json({ message: errors.join(". ") });
    }

    const activityData = { ...req.body };
    if (req.file) {
      activityData.image = `/uploads/${req.file.filename}`;
    }
    const activity = new Activity(activityData);
    await activity.save();
    res.json({ message: "Activity added successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// UPDATE ACTIVITY (Admin)
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const updateData = { ...req.body };
    
    // Remove immutable fields that the frontend sends via FormData
    delete updateData._id;
    delete updateData.__v;
    delete updateData.createdAt;

    // Convert string values from FormData to correct types
    if (updateData.price !== undefined) updateData.price = Number(updateData.price);
    if (updateData.slotsAvailable !== undefined) updateData.slotsAvailable = Number(updateData.slotsAvailable);
    if (updateData.available !== undefined) updateData.available = updateData.available === 'true' || updateData.available === true;

    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    const activity = await Activity.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }
    res.json({ message: "Activity updated successfully", activity });
  } catch (error) {
    console.error("Activity update error:", error.message);
    res.status(500).json({ message: "Update failed: " + error.message });
  }
});

// DELETE ACTIVITY (Admin)
router.delete("/:id", async (req, res) => {
  await Activity.findByIdAndDelete(req.params.id);
  res.json({ message: "Activity deleted successfully" });
});

module.exports = router;
