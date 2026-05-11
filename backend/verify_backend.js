const axios = require('axios');

const API_URL = 'http://localhost:5000/api/auth';

const testAuth = async () => {
    try {
        // 1. Register
        console.log("Testing Registration...");
        const email = `test${Date.now()}@example.com`;
        const password = "password123";

        try {
            await axios.post(`${API_URL}/register`, {
                name: "Test User",
                email,
                password
            });
            console.log("✅ Registration Successful");
        } catch (error) {
            console.error("❌ Registration Failed:", error.response?.data || error.message);
        }

        // 2. Login
        console.log("\nTesting Login...");
        try {
            const loginRes = await axios.post(`${API_URL}/login`, {
                email,
                password
            });

            if (loginRes.data.token) {
                console.log("✅ Login Successful. Token received.");
                console.log("Token:", loginRes.data.token.substring(0, 20) + "...");
            } else {
                console.error("❌ Login Failed: No token received");
            }
        } catch (error) {
            console.error("❌ Login Failed:", error.response?.data || error.message);
        }

        // 3. Test Invalid Login
        console.log("\nTesting Invalid Login...");
        try {
            await axios.post(`${API_URL}/login`, {
                email,
                password: "wrongpassword"
            });
            console.error("❌ Invalid Login Failed: Should have returned error but succeeded");
        } catch (error) {
            if (error.response?.status === 400) {
                console.log("✅ Invalid Login correctly rejected");
            } else {
                console.error("❌ Invalid Login Failed with unexpected error:", error.message);
            }
        }

    } catch (error) {
        console.error("Unexpected Error:", error.message);
    }
};

testAuth();
