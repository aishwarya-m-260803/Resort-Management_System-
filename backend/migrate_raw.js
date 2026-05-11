const { MongoClient } = require('mongodb');

const url = 'mongodb://localhost:27017';
const dbName = 'resort_project';
const rate = 83;

async function run() {
    const client = new MongoClient(url);
    try {
        await client.connect();
        const db = client.db(dbName);
        console.log('Connected to MongoDB RAW...');

        const rooms = db.collection('rooms');
        const activities = db.collection('activities');
        const roombookings = db.collection('roombookings');
        const activitybookings = db.collection('activitybookings');

        console.log('Migrating Rooms...');
        await rooms.updateMany({}, [
            { $set: { price: { $multiply: ['$price', rate] } } }
        ]);

        console.log('Migrating Activities...');
        await activities.updateMany({}, [
            { $set: { price: { $multiply: ['$price', rate] } } }
        ]);

        console.log('Migrating Room Bookings...');
        await roombookings.updateMany({}, [
            { $set: { totalPrice: { $multiply: ['$totalPrice', rate] } } }
        ]);

        console.log('Migrating Activity Bookings...');
        await activitybookings.updateMany({}, [
            { $set: { totalPrice: { $multiply: ['$totalPrice', rate] } } }
        ]);

        console.log('Raw migration successful.');
    } catch (err) {
        console.error('Migration error:', err);
    } finally {
        await client.close();
    }
}

run();
