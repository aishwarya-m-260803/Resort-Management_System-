const express = require("express");
const router = express.Router();
const diningController = require("../controllers/diningController");
const authMiddleware = require("../middleware/authMiddleware");

// @route   POST /api/dining-bookings
// @desc    Create a new fine dining reservation
// @access  Private
router.post("/dining-bookings", authMiddleware, diningController.createDiningBooking);

// @route   GET /api/my-dining-bookings
// @desc    Get logged-in user's reservations
// @access  Private
router.get("/my-dining-bookings", authMiddleware, diningController.getMyDiningBookings);

// @route   GET /api/admin/dining-bookings
// @desc    Get all reservations (Admin only check should be in controller if needed)
// @access  Private
router.get("/admin/dining-bookings", authMiddleware, diningController.getAllDiningBookings);

module.exports = router;
