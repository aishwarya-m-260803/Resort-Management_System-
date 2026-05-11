const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const session = require("express-session");
const path = require("path");
const fs = require("fs");

dotenv.config();

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

const connectDB = require("./config/db");

const app = express();

// Connect to MongoDB
const createAdminUser = require("./utils/createAdmin");
const migrateUserRoles = require("./utils/migrateUserRoles");

// Connect to MongoDB
connectDB().then(() => {
  migrateUserRoles();
  createAdminUser();
});

// Middlewares
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Session Configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'aurelia_resort_secret_key',
  resave: false,
  saveUninitialized: false,
  rolling: false,
  name: 'aurelia.sid',
  cookie: {
    maxAge: 1000 * 60 * 60 * 2, // 2 hours
    secure: false, // Set to true if using HTTPS
    httpOnly: true,
    sameSite: 'lax'
  }
}));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/uploads/profiles", express.static(path.join(__dirname, "public/uploads/profiles")));
app.use("/uploads/users", express.static(path.join(__dirname, "public/uploads/users")));

// Test route
app.get("/", (req, res) => {
  res.send("Resort backend running");
});

// Routes
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const userRoutes = require("./routes/userRoutes");
const roomRoutes = require("./routes/roomRoutes");
const activityRoutes = require("./routes/activityRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
// const analyticsRoutes = require("./routes/analyticsRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api", bookingRoutes);
// app.use("/api/analytics", analyticsRoutes);

// Debug routes (development only)
const debugRoutes = require("./routes/debugRoutes");
app.use("/api/debug", debugRoutes);

// Clear users route (development only)
const clearRoutes = require("./routes/clearRoutes");
app.use("/api/admin", clearRoutes);

// Dining Routes
const diningRoutes = require("./routes/diningRoutes");
app.use("/api", diningRoutes);


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
