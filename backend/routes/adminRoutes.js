const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../models/User");
const RoomBooking = require("../models/RoomBooking");
const ActivityBooking = require("../models/ActivityBooking");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// Apply both middlewares to all routes in this file
const adminAuth = [authMiddleware, adminMiddleware];

// =============================================
// GET /api/admin/users — Advanced CRM User List
// Uses MongoDB aggregation pipeline
// =============================================
router.get("/users", adminAuth, async (req, res) => {
    try {
        const users = await User.aggregate([
            // Step 1: Only regular users
            { $match: { role: "user" } },

            // Step 2: Lookup room bookings for each user
            {
                $lookup: {
                    from: "roombookings",
                    localField: "_id",
                    foreignField: "user",
                    as: "roomBookings"
                }
            },

            // Step 3: Lookup room details to get prices
            {
                $lookup: {
                    from: "rooms",
                    localField: "roomBookings.room",
                    foreignField: "_id",
                    as: "roomDetails"
                }
            },

            // Step 4: Lookup activity bookings for each user
            {
                $lookup: {
                    from: "activitybookings",
                    localField: "_id",
                    foreignField: "user",
                    as: "activityBookings"
                }
            },

            // Step 5: Compute aggregated stats
            {
                $addFields: {
                    totalRoomBookings: { $size: "$roomBookings" },
                    totalActivityBookings: { $size: "$activityBookings" },
                    totalBookings: {
                        $add: [{ $size: "$roomBookings" }, { $size: "$activityBookings" }]
                    },
                    roomSpent: {
                        $reduce: {
                            input: "$roomBookings",
                            initialValue: 0,
                            in: { $add: ["$$value", { $ifNull: ["$$this.totalPrice", 0] }] }
                        }
                    },
                    activitySpent: {
                        $reduce: {
                            input: "$activityBookings",
                            initialValue: 0,
                            in: { $add: ["$$value", { $ifNull: ["$$this.totalPrice", 0] }] }
                        }
                    },
                    lastRoomBookingDate: {
                        $cond: {
                            if: { $gt: [{ $size: "$roomBookings" }, 0] },
                            then: { $max: "$roomBookings.checkInDate" },
                            else: null
                        }
                    },
                    lastActivityBookingDate: {
                        $cond: {
                            if: { $gt: [{ $size: "$activityBookings" }, 0] },
                            then: { $max: "$activityBookings.bookingDate" },
                            else: null
                        }
                    }
                }
            },

            // Step 6: Compute totalSpent and lastBookingDate
            {
                $addFields: {
                    totalSpent: { $add: ["$roomSpent", "$activitySpent"] },
                    lastBookingDate: {
                        $cond: {
                            if: {
                                $and: [
                                    { $ne: ["$lastRoomBookingDate", null] },
                                    { $ne: ["$lastActivityBookingDate", null] }
                                ]
                            },
                            then: {
                                $cond: {
                                    if: { $gte: ["$lastRoomBookingDate", "$lastActivityBookingDate"] },
                                    then: "$lastRoomBookingDate",
                                    else: "$lastActivityBookingDate"
                                }
                            },
                            else: {
                                $ifNull: ["$lastRoomBookingDate", "$lastActivityBookingDate"]
                            }
                        }
                    }
                }
            },

            // Step 7: Add VIP classification
            {
                $addFields: {
                    vip: {
                        $cond: {
                            if: { $gt: ["$totalSpent", 50000] },
                            then: "VIP",
                            else: {
                                $cond: {
                                    if: { $gt: ["$totalSpent", 20000] },
                                    then: "Premium",
                                    else: "Regular"
                                }
                            }
                        }
                    }
                }
            },

            // Step 8: Project only needed fields (exclude password & temp arrays)
            {
                $project: {
                    _id: 1,
                    name: 1,
                    email: 1,
                    phone: 1,
                    status: 1,
                    createdAt: 1,
                    totalRoomBookings: 1,
                    totalActivityBookings: 1,
                    totalBookings: 1,
                    totalSpent: 1,
                    lastBookingDate: 1,
                    vip: 1
                }
            },

            // Step 9: Sort by most recent first
            { $sort: { createdAt: -1 } }
        ]);

        res.json(users);
    } catch (error) {
        console.error("Aggregation error:", error);
        res.status(500).json({ error: error.message });
    }
});

// =============================================
// GET /api/admin/users/:id — Single User Details
// =============================================
router.get("/users/:id", adminAuth, async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });

        const roomBookings = await RoomBooking.find({ user: user._id })
            .populate("room", "name category price image");
        const activityBookings = await ActivityBooking.find({ user: user._id })
            .populate("activity", "name category price image");

        res.json({ user, roomBookings, activityBookings });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// =============================================
// PATCH /api/admin/users/:id/status — Block/Unblock
// =============================================
router.patch("/users/:id/status", adminAuth, async (req, res) => {
    try {
        const { status } = req.body;

        if (!["active", "blocked"].includes(status)) {
            return res.status(400).json({ message: "Invalid status. Must be 'active' or 'blocked'." });
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        ).select("-password");

        if (!user) return res.status(404).json({ message: "User not found" });

        res.json({
            message: `User ${status === "blocked" ? "blocked" : "activated"} successfully`,
            user
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// =============================================
// DELETE /api/admin/users/:id — Delete User
// =============================================
router.delete("/users/:id", adminAuth, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        // Safety: Do not allow deleting admin accounts
        if (user.role === "admin") {
            return res.status(403).json({ message: "Cannot delete admin accounts" });
        }

        // Delete all associated bookings
        await RoomBooking.deleteMany({ user: user._id });
        await ActivityBooking.deleteMany({ user: user._id });
        await User.findByIdAndDelete(req.params.id);

        res.json({ message: "User and associated bookings deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
