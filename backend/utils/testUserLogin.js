const User = require("../models/User");
const bcrypt = require("bcryptjs");

const testUserLogin = async (email, password) => {
    try {
        console.log("\n=== TEST USER LOGIN ===");
        console.log("Testing email:", email);
        console.log("Testing password:", password);

        // Find user
        const user = await User.findOne({ email });
        
        if (!user) {
            console.log("❌ User not found in database");
            return false;
        }

        console.log("✅ User found in database");
        console.log("   Name:", user.name);
        console.log("   Email:", user.email);
        console.log("   Role:", user.role);
        console.log("   Password hash:", user.password.substring(0, 30) + "...");
        console.log("   Hash length:", user.password.length);

        // Test password comparison
        console.log("\nTesting password comparison...");
        
        // Direct comparison
        const isMatch = await user.comparePassword(password);
        console.log("bcrypt.compare result:", isMatch);

        if (isMatch) {
            console.log("✅ PASSWORD MATCH - Login should succeed");
        } else {
            console.log("❌ PASSWORD MISMATCH - Login will fail");
            
            // Try manual comparison to debug
            console.log("\nDebugging password comparison:");
            console.log("Hash:", user.password);
            console.log("Password to compare:", password);
            
            const manualMatch = await bcrypt.compare(password, user.password);
            console.log("Manual bcrypt.compare result:", manualMatch);
        }

        console.log("=== END TEST ===\n");
        return isMatch;

    } catch (error) {
        console.error("Test error:", error.message);
        return false;
    }
};

module.exports = testUserLogin;
