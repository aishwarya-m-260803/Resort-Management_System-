const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Define storage location and filename
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, "../public/uploads/profiles/");
        
        // Ensure the directory exists
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // Create unique filenames based on the user ID or a timestamp
        const userId = req.user?.id || "admin";
        const fileExt = path.extname(file.originalname);
        cb(null, `profile-${userId}-${Date.now()}${fileExt}`);
    }
});

// File filter to only allow images
const fileFilter = (req, file, cb) => {
    const allowedFileTypes = /jpeg|jpg|png|webp/;
    const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedFileTypes.test(file.mimetype);
    
    if (extname && mimetype) {
        cb(null, true);
    } else {
        cb(new Error("Only images (jpeg, jpg, png, webp) are allowed."), false);
    }
};

// Initialize multer with storage and file filter
const profileUpload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: fileFilter
});

module.exports = profileUpload;
