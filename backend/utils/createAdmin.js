const User = require("../models/User");

const createAdminUser = async () => {
    try {
        const adminEmail = "admin@resort.com";
        const existingAdmin = await User.findOne({ email: adminEmail });

        if (!existingAdmin) {
            const adminUser = new User({
                name: "Admin",
                email: adminEmail,
                password: "Admin@123",
                role: "admin"
            });

            // Password will be hashed automatically by User model pre-save middleware
            await adminUser.save();
            console.log("Admin user created successfully");
            console.log("Admin credentials - Email: admin@resort.com, Password: Admin@123");
        } else {
            console.log("Admin user already exists");
        }
    } catch (error) {
        console.error("Error creating admin user:", error);
    }
};

module.exports = createAdminUser;
