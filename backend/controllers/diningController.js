const DiningBooking = require("../models/DiningBooking");

// CREATE DINING BOOKING
exports.createDiningBooking = async (req, res) => {
    try {
        const { user, date, timeSlot, guests, seatingPreference, dietaryNotes, occasion } = req.body;

        // 1. Basic Validation
        if (!user || !date || !timeSlot || !guests) {
            return res.status(400).json({ message: "Missing required fields: user, date, timeSlot, guests" });
        }

        // 2. Lead Time Validation (Min 2 hours in advance)
        const bookingDateTime = new Date(`${date}T${timeSlot}`);
        const now = new Date();
        const twoHoursFromNow = new Date(now.getTime() + 2 * 60 * 60 * 1000);

        if (bookingDateTime < twoHoursFromNow) {
            return res.status(400).json({ message: "Reservations must be made at least 2 hours in advance." });
        }

        // 3. timing Validation (Lunch: 12 PM - 3 PM, Dinner: 7 PM - 11 PM)
        const hour = parseInt(timeSlot.split(":")[0]);
        const isLunch = hour >= 12 && hour < 15;
        const isDinner = hour >= 19 && hour < 23;

        if (!isLunch && !isDinner) {
            return res.status(400).json({ 
                message: "Fine Dining is available during: Lunch (12 PM - 3 PM) and Dinner (7 PM - 11 PM)." 
            });
        }

        // 4. Capacity Check (Max 20 guests per time slot across all bookings)
        const existingBookings = await DiningBooking.find({ date, timeSlot, status: "Confirmed" });
        const totalGuests = existingBookings.reduce((sum, b) => sum + b.guests, 0);

        if (totalGuests + parseInt(guests) > 20) {
            const available = 20 - totalGuests;
            return res.status(400).json({ 
                message: `Apologies, we only have space for ${available} more guest(s) at this time.` 
            });
        }

        // 5. Generate Unique Booking ID (DIN-XXXX)
        const count = await DiningBooking.countDocuments();
        const bookingId = `DIN-${1000 + count + 1}`;

        // 6. Save Booking
        const booking = new DiningBooking({
            user,
            bookingId,
            date,
            timeSlot,
            guests: parseInt(guests),
            seatingPreference,
            dietaryNotes,
            occasion,
            status: "Confirmed"
        });

        await booking.save();
        res.status(201).json({ message: "Reservation confirmed successfully!", booking });

    } catch (error) {
        console.error("Dining booking error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// GET USER'S DINING BOOKINGS
exports.getMyDiningBookings = async (req, res) => {
    try {
        const userId = req.user.id;
        const bookings = await DiningBooking.find({ user: userId }).sort({ createdAt: -1 });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET ALL DINING BOOKINGS (Admin)
exports.getAllDiningBookings = async (req, res) => {
    try {
        const bookings = await DiningBooking.find().populate("user", "name email");
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
