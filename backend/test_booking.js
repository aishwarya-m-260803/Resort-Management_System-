async function testBooking() {
    try {
        const response = await fetch('http://localhost:5001/api/activity-bookings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user: "65dae3000000000000000001",
                activity: "65dae3000000000000000002",
                bookingDate: new Date(),
                price: 150
            })
        });

        const text = await response.text();
        console.log('Status:', response.status);
        console.log('Response:', text);
    } catch (error) {
        console.error('Error fetching:', error.message);
    }
}

testBooking();
