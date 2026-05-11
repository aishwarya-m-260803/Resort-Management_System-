const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ["Standard", "Deluxe", "Suite", "Villa"],
        required: true
    },
    description: String,
    price: {
        type: Number,
        required: true
    },
    capacity: {
        type: Number,
        required: true
    },
    totalRooms: {
        type: Number,
        required: true
    },
    availableRooms: {
        type: Number,
        required: true
    },
    available: {
        type: Boolean,
        default: true
    },
    image: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Room", roomSchema);
