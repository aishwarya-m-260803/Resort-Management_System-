const express = require("express");
const multer = require("multer");
const path = require("path");
const { register, login, updateProfile, changePassword, uploadProfileImage } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

const profileUpload = require("../middleware/profileUpload");

router.post("/register", register);
router.post("/login", login);
router.put("/profile", authMiddleware, updateProfile);
router.put("/change-password", authMiddleware, changePassword);
router.put("/profile-image", authMiddleware, profileUpload.single("profile_pic"), uploadProfileImage);

module.exports = router;
