const mongoose = require("mongoose");

const diningBookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    bookingId: {
        type: String,
        required: true,
        unique: true
    },
    date: {
        type: String, // Stored as YYYY-MM-DD
        required: true
    },
    timeSlot: {
        type: String,
        required: true
    },
    guests: {
        type: Number,
        required: true,
        min: 1,
        max: 20
    },
    seatingPreference: {
        type: String,
        enum: ["Window side", "Garden view"],
        default: "Garden view"
    },
    dietaryNotes: {
        type: String,
        default: ""
    },
    occasion: {
        type: String,
        default: ""
    },
    status: {
        type: String,
        enum: ["Confirmed", "Cancelled"],
        default: "Confirmed"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("DiningBooking", diningBookingSchema);
