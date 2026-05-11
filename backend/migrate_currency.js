const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const Room = require('./models/Room');
const Activity = require('./models/Activity');
const RoomBooking = require('./models/RoomBooking');
const ActivityBooking = require('./models/ActivityBooking');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/resort_project';
const CONVERSION_RATE = 83;

mongoose.connect(MONGODB_URI)
    .then(async () => {
        console.log('Connected to MongoDB for currency migration...');

        // Update Rooms
        console.log('Updating Rooms...');
        await Room.updateMany({}, [
            { $set: { price: { $multiply: ['$price', CONVERSION_RATE] } } }
        ]);

        // Update Activities
        console.log('Updating Activities...');
        await Activity.updateMany({}, [
            { $set: { price: { $multiply: ['$price', CONVERSION_RATE] } } }
        ]);

        // Update Room Bookings
        console.log('Updating Room Bookings...');
        await RoomBooking.updateMany({}, [
            { $set: { totalPrice: { $multiply: ['$totalPrice', CONVERSION_RATE] } } }
        ]);

        // Update Activity Bookings
        console.log('Updating Activity Bookings...');
        await ActivityBooking.updateMany({}, [
            { $set: { totalPrice: { $multiply: ['$totalPrice', CONVERSION_RATE] } } }
        ]);

        console.log('Currency migration completed successfully.');
        process.exit(0);
    })
    .catch(err => {
        console.error('Migration failed:', err);
        process.exit(1);
    });
