const Room = require("../models/Room");
const Activity = require("../models/Activity");
const RoomBooking = require("../models/RoomBooking");
const ActivityBooking = require("../models/ActivityBooking");
const User = require("../models/User");

// CREATE ROOM BOOKING
exports.createRoomBooking = async (req, res) => {
    console.log("BODY RECEIVED:", JSON.stringify(req.body, null, 2));
    try {
        const { user, room: roomId, checkInDate, checkOutDate, guests } = req.body;

        if (!user || !roomId || !checkInDate || !checkOutDate || !guests) {
            return res.status(400).json({
                message: "Missing required fields: user, room, checkInDate, checkOutDate, guests",
                receivedBody: req.body
            });
        }

        const room = await Room.findById(roomId);
        if (!room) return res.status(404).json({ message: "Room not found" });

        if (room.availableRooms <= 0) {
            return res.status(400).json({ message: "No rooms available" });
        }

        // Calculate nights and total price
        const checkIn = new Date(checkInDate);
        const checkOut = new Date(checkOutDate);
        const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));

        if (nights <= 0) {
            return res.status(400).json({ message: "Check-out date must be after check-in date" });
        }

        if (guests > room.capacity) {
            return res.status(400).json({ message: `Maximum capacity is ${room.capacity} guests` });
        }

        const totalPrice = nights * room.price;

        const booking = new RoomBooking({
            user,
            room: roomId,
            checkInDate: checkIn,
            checkOutDate: checkOut,
            guests,
            totalPrice
        });

        await booking.save();

        // Reduce availableRooms
        room.availableRooms -= 1;
        await room.save();

        res.status(201).json({ message: "Room booked successfully", booking });
    } catch (error) {
        console.error("Room booking error:", error);
        res.status(400).json({ message: error.message });
    }
};

// CREATE ACTIVITY BOOKING
exports.createActivityBooking = async (req, res) => {
    try {
        const { user, activity: activityId, bookingDate, slotsBooked } = req.body;

        // Validate required fields
        if (!user || !activityId || !bookingDate || !slotsBooked) {
            return res.status(400).json({ message: "Missing required fields: user, activity, bookingDate, slotsBooked" });
        }

        if (Number(slotsBooked) < 1) {
            return res.status(400).json({ message: "Slots booked must be at least 1" });
        }

        const bookDate = new Date(bookingDate);
        if (isNaN(bookDate.getTime())) {
            return res.status(400).json({ message: "Invalid booking date" });
        }

        const activity = await Activity.findById(activityId);
        if (!activity) return res.status(404).json({ message: "Activity not found" });

        if (activity.slotsAvailable < slotsBooked) {
            return res.status(400).json({ message: `Only ${activity.slotsAvailable} slots available` });
        }

        const totalPrice = slotsBooked * activity.price;

        const booking = new ActivityBooking({
            user,
            activity: activityId,
            bookingDate,
            slotsBooked,
            totalPrice
        });

        await booking.save();

        // Reduce slotsAvailable
        activity.slotsAvailable -= slotsBooked;
        await activity.save();

        res.status(201).json({ message: "Activity booked successfully", booking });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET ALL ROOM BOOKINGS (Admin)
exports.getAllRoomBookings = async (req, res) => {
    try {
        const bookings = await RoomBooking.find()
            .populate("user", "name email")
            .populate("room", "name category price image");
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET ALL ACTIVITY BOOKINGS (Admin)
exports.getAllActivityBookings = async (req, res) => {
    try {
        const bookings = await ActivityBooking.find()
            .populate("user", "name email")
            .populate("activity", "name category price");
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET ALL USERS (Admin)
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({ role: "user" }).select("-password");
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
