const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");

// User routes
router.post("/room-bookings", bookingController.createRoomBooking);
router.post("/activity-bookings", bookingController.createActivityBooking);

// Admin routes
router.get("/room-bookings", bookingController.getAllRoomBookings);
router.get("/activity-bookings", bookingController.getAllActivityBookings);
router.get("/admin/users", bookingController.getAllUsers);

module.exports = router;
