const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

const router = express.Router();

// Debug endpoint - only use in development
// WARNING: This endpoint exposes user information, only for debugging

router.get("/users", async (req, res) => {
  try {
    const users = await User.find({}, { name: 1, email: 1, role: 1, password: 1 });
    res.json({
      message: "All users in database (DEBUG ONLY)",
      count: users.length,
      users: users.map(user => ({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        passwordHashLength: user.password ? user.password.length : 0,
        passwordHashPrefix: user.password ? user.password.substring(0, 20) : "none"
      }))
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/user/:email", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) {
      return res.json({ message: `No user found with email: ${req.params.email}` });
    }
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      passwordHashLength: user.password.length,
      passwordHashPrefix: user.password.substring(0, 20),
      passwordHashFull: user.password
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Test login endpoint
router.post("/test-login", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log("\n=== TEST LOGIN ENDPOINT ===");
    console.log("Email:", email);
    console.log("Password provided:", password ? "Yes" : "No");

    if (!email || !password) {
      console.log("Missing email or password");
      return res.status(400).json({ 
        error: "Email and password required",
        received: { email: !!email, password: !!password }
      });
    }

    // Find user
    const user = await User.findOne({ email });
    
    if (!user) {
      console.log("❌ User not found");
      return res.json({
        success: false,
        message: "User not found",
        email: email
      });
    }

    console.log("✅ User found:", user.name);
    console.log("   Role:", user.role);
    console.log("   Hash length:", user.password.length);
    console.log("   Hash prefix:", user.password.substring(0, 30));

    // Test password comparison
    console.log("Testing password comparison...");
    let isMatch = false;
    
    try {
      isMatch = await bcrypt.compare(password, user.password);
    } catch (compareError) {
      console.error("Comparison error:", compareError.message);
      return res.status(500).json({
        error: "Password comparison failed",
        message: compareError.message
      });
    }

    console.log("Password match:", isMatch);

    if (!isMatch) {
      console.log("❌ Password mismatch");
      return res.json({
        success: false,
        message: "Password incorrect",
        email: email,
        passwordMatch: false
      });
    }

    console.log("✅ Login test successful");
    console.log("=== END TEST ===\n");

    res.json({
      success: true,
      message: "Login test successful - credentials are valid",
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
        passwordMatch: true
      }
    });

  } catch (error) {
    console.error("Test-login error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
