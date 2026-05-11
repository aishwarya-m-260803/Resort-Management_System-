const express = require("express");
const userUpload = require("../middleware/userUpload.js");
const authMiddleware = require("../middleware/authMiddleware.js");
const User = require("../models/User.js");

const router = express.Router();

// @route   POST /api/user/upload-profile-pic
// @desc    Upload user profile picture
// @access  Private
router.post("/upload-profile-pic", authMiddleware, userUpload.single("profile_pic"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No photo provided" });
        }

        const userId = req.user.id;
        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Store relative path for accessibility
        const photoPath = `/uploads/users/${req.file.filename}`;
        user.profile_pic = photoPath;
        await user.save();

        res.status(200).json({
            message: "Profile photo updated",
            user: {
                _id: user._id,
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                profile_pic: user.profile_pic
            }
        });
    } catch (error) {
        console.error("Upload error:", error.message);
        res.status(500).json({ message: "Server error: " + error.message });
    }
});

module.exports = router;
