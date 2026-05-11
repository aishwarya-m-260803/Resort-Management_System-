const express = require("express");
const multer = require("multer");
const path = require("path");
const Room = require("../models/Room");

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

// ADD ROOM (Admin)
router.post("/add", upload.single("image"), async (req, res) => {
    try {
        const { name, category, price, capacity, totalRooms, availableRooms } = req.body;

        // Backend validation
        const errors = [];
        if (!name || !name.trim()) errors.push("Room name is required");
        if (!category) errors.push("Category is required");
        if (!price || Number(price) <= 0) errors.push("Price must be greater than 0");
        if (!capacity || Number(capacity) < 1) errors.push("Capacity must be at least 1");
        if (!totalRooms || Number(totalRooms) < 1) errors.push("Total rooms must be at least 1");
        if (availableRooms !== undefined && Number(availableRooms) > Number(totalRooms)) {
            errors.push("Available rooms cannot exceed total rooms");
        }
        if (errors.length > 0) {
            return res.status(400).json({ message: errors.join(". ") });
        }

        const roomData = { ...req.body };
        if (req.file) {
            roomData.image = `/uploads/${req.file.filename}`;
        }
        const room = new Room(roomData);
        await room.save();
        res.json({ message: "Room added successfully" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// VIEW ALL ROOMS (User/Admin)
router.get("/", async (req, res) => {
    try {
        const rooms = await Room.find();
        res.json(rooms);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// UPDATE ROOM (Admin)
router.put("/:id", upload.single("image"), async (req, res) => {
    try {
        const updateData = { ...req.body };
        if (req.file) {
            updateData.image = `/uploads/${req.file.filename}`;
        }
        await Room.findByIdAndUpdate(req.params.id, updateData);
        res.json({ message: "Room updated successfully" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// DELETE ROOM (Admin)
router.delete("/:id", async (req, res) => {
    try {
        await Room.findByIdAndDelete(req.params.id);
        res.json({ message: "Room deleted successfully" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
