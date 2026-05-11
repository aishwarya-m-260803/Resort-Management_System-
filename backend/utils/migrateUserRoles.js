const User = require("../models/User");

const migrateUserRoles = async () => {
    try {
        console.log("Starting user role migration...");

        // Update any users with incorrect roles
        const result = await User.updateMany(
            { role: { $nin: ["user", "admin"] } }, // Find users with roles NOT in ["user", "admin"]
            { $set: { role: "user" } } // Set them to "user"
        );

        console.log(`Migration complete. Updated ${result.modifiedCount} users.`);

        // Log all users in database with their roles
        const allUsers = await User.find({}, { name: 1, email: 1, role: 1 });
        console.log("\nAll users in database:");
        allUsers.forEach(user => {
            console.log(`- ${user.email} (${user.name}): ${user.role}`);
        });

    } catch (error) {
        console.error("Error during migration:", error);
    }
};

module.exports = migrateUserRoles;
