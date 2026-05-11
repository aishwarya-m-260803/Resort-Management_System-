const express = require("express");
const User = require("../models/User");

const router = express.Router();

// DANGER: This endpoint clears all non-admin users - DEVELOPMENT ONLY
router.post("/clear-users", async (req, res) => {
  try {
    const result = await User.deleteMany({ role: "user" });
    console.log(`✅ Cleared ${result.deletedCount} regular users from database`);
    
    const remaining = await User.countDocuments();
    console.log(`Total users remaining: ${remaining}`);
    
    res.json({
      message: `Deleted ${result.deletedCount} users. All non-admin users cleared.`,
      deletedCount: result.deletedCount,
      remainingCount: remaining
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
