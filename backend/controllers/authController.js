const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// REGISTER
exports.register = async (req, res) => {
    try {
        console.log("Register request received");
        console.log("Request body:", req.body);

        const { name, email, password } = req.body;

        // Enhanced validation
        if (!name || !email || !password) {
            return res.status(400).json({ message: "Please enter all fields" });
        }
        if (name.trim().length < 3) {
            return res.status(400).json({ message: "Name must be at least 3 characters" });
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({ message: "Please enter a valid email address" });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log(`User with email ${email} already exists`);
            return res.status(400).json({ message: "Email already registered" });
        }

        // Create new user (password will be hashed by pre-save middleware)
        const user = new User({
            name,
            email,
            password,
            role: "user"
        });

        console.log("Creating new user with email:", email);
        await user.save();
        console.log("User saved successfully:", user._id);

        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error("Register error:", error.message);
        res.status(500).json({ message: error.message });
    }
};

// LOGIN
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        console.log("=== LOGIN ATTEMPT ===");
        console.log("Email:", email);
        console.log("Password provided:", password ? "Yes" : "No");

        // Validate input
        if (!email || !password) {
            console.log("Validation failed - missing fields");
            return res.status(400).json({ message: "Please enter email and password" });
        }

        // Check if user exists
        const user = await User.findOne({ email });
        console.log("User found:", user ? "Yes" : "No");

        if (!user) {
            console.log(`User with email ${email} not found in database`);
            return res.status(401).json({ message: "Invalid email or password" });
        }

        console.log("User details - Name:", user.name, "Role:", user.role);
        console.log("Stored password hash exists:", user.password ? "Yes" : "No");

        // Compare password using the method from User model
        console.log("Attempting password comparison...");
        let isPasswordValid = false;

        try {
            isPasswordValid = await user.comparePassword(password);
        } catch (compareError) {
            console.error("Password comparison error:", compareError.message);
            return res.status(500).json({ message: "Authentication error: " + compareError.message });
        }

        console.log("Password valid:", isPasswordValid);

        if (!isPasswordValid) {
            console.log(`Password incorrect for user ${email}`);
            return res.status(401).json({ message: "Invalid email or password" });
        }

        console.log(`Password valid for user ${email}, role: ${user.role}`);

        // Generate JWT token - expires in 1 day
        // FORCE role into payload to ensure it is always present
        const tokenPayload = { 
            id: user._id, 
            role: user.role || "user" 
        };
        
        console.log("DEBUG - Creating token with payload:", tokenPayload);

        const token = jwt.sign(
            tokenPayload,
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        console.log(`Token generated successfully for user ${email}`);
        
        // Set Session
        req.session.user = {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        };

        console.log("=== LOGIN SUCCESS ===\n");

        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                _id: user._id,
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone,
                profile_pic: user.profile_pic
            }
        });
    } catch (error) {
        console.error("=== LOGIN ERROR ===");
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
        console.error("================\n");
        res.status(500).json({ message: "Server error: " + error.message });
    }
};
// UPDATE PROFILE
exports.updateProfile = async (req, res) => {
    try {
        const { name, email, phone } = req.body;
        const userId = req.user.id; // From authMiddleware

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // If email is changing, check for uniqueness
        if (email && email !== user.email) {
            const emailExists = await User.findOne({ email });
            if (emailExists) {
                return res.status(400).json({ message: "Email already in use" });
            }
            user.email = email;
        }

        if (name) user.name = name;
        if (phone) user.phone = phone;

        await user.save();

        res.status(200).json({
            message: "Profile updated successfully",
            user: {
                _id: user._id,
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                profile_pic: user.profile_pic
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Server error: " + error.message });
    }
};

// CHANGE PASSWORD
exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.user.id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(400).json({ message: "Incorrect current password" });
        }

        user.password = newPassword; // Will be hashed by pre-save middleware
        await user.save();

        res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error: " + error.message });
    }
};

// UPLOAD PROFILE IMAGE
exports.uploadProfileImage = async (req, res) => {
    try {
        const userId = req.user.id;

        if (!req.file) {
            return res.status(400).json({ message: "No image file provided" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.profile_pic = `/uploads/profiles/${req.file.filename}`;
        await user.save();

        res.status(200).json({
            message: "Profile photo updated successfully",
            user: {
                _id: user._id,
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                profile_pic: user.profile_pic
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Server error: " + error.message });
    }
};
