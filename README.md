# 🏨 Resort Management System

A full-stack web application for comprehensive resort operations management—enabling seamless guest bookings and powerful admin controls.

## ✨ Key Features

**For Guests:**
- Secure JWT-based authentication with role-based access control
- Browse & book rooms across multiple categories (Standard, Deluxe, Suite, Villa)
- Discover and register for wellness & recreational activities
- Reserve fine dining experiences with custom preferences
- Manage all reservations from a unified dashboard
- Responsive UI with smooth animations

**For Admins:**
- Comprehensive operations dashboard
- Full booking, room, activity, and dining management
- User status monitoring and profile management

## 🛠️ Tech Stack

| Layer | Technologies |
|-------|---------------|
| **Backend** | Node.js, Express.js v5.2 |
| **Frontend** | React.js v19.2, React Router v7, Framer Motion |
| **Database** | MongoDB (Mongoose ODM) |
| **Authentication** | JWT, bcryptjs, Express-session |
| **File Handling** | Multer |
| **UI Components** | Lucide React icons, CSS3 |

**Why MongoDB?** Document-based storage provides flexible schema for diverse resort data (rooms, activities, bookings with varying attributes), enabling rapid feature iteration and scalability.

## 📋 Installation & Setup

**Prerequisites:** Node.js v14+, npm, MongoDB (local or Atlas), Git

### Quick Start
```bash
# Clone and navigate
git clone https://github.com/your-username/resort-management-system.git
cd resort-management-system

# Install all dependencies
npm run install-all
```

### Environment Configuration
Create `.env` in `backend/` directory:
```env
MONGO_URI=mongodb://localhost:27017/resort_db
PORT=5000
SESSION_SECRET=your_session_secret_key
```

For MongoDB Atlas:
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/resort_db
```

### Run the Application
```bash
# Development mode (both services)
npm run dev

# Individual services
cd backend && npm start          # http://localhost:5000
cd ../frontend && npm start      # http://localhost:3000
```

The system auto-creates MongoDB collections, default admin user, and handles role migrations on first run.

## 🎯 Usage

**User Flow:** Register → Browse Rooms/Activities → Make Bookings → Manage Reservations

**Guest Access:** http://localhost:3000
- Register and login
- Browse available rooms, activities, dining options
- Create and track reservations
- Update profile and preferences

**Admin Access:** http://localhost:3000/admin-login
- Dashboard with operational overview
- Manage bookings, rooms, activities, and dining
- Monitor user accounts
- Update admin profile

**API Base:** http://localhost:5000/api

## 📁 Project Structure

```
resort-project/
├── backend/
│   ├── config/          → Database configuration
│   ├── controllers/     → Business logic (auth, bookings, dining)
│   ├── middleware/      → JWT auth, admin check, file uploads
│   ├── models/          → MongoDB schemas (User, Room, Activity, Booking)
│   ├── routes/          → API endpoints
│   ├── utils/           → Helper functions & utilities
│   ├── uploads/         → User uploads (images, profiles)
│   └── server.js        → Express server entry point
│
├── frontend/
│   └── src/
│       ├── components/  → Reusable UI components (Navbar, Routes, Animations)
│       ├── context/     → State management (Auth, Toast)
│       ├── pages/       → User & admin pages with category separations
│       ├── utils/       → Helper functions (currency, animations)
│       └── App.js       → Root React component
│
└── package.json         → Root scripts (install-all, dev mode)
```

## � API Overview

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/register` | POST | User registration |
| `/api/auth/login` | POST | User login |
| `/api/rooms` | GET/POST | Browse or create rooms |
| `/api/activities` | GET/POST | Browse or create activities |
| `/api/bookings` | POST/GET | Create or retrieve bookings |
| `/api/dining` | POST/GET | Dining reservations |
| `/api/admin/*` | GET/PUT | Admin management endpoints |

## � Security

- **JWT Authentication** for secure session management
- **Password Hashing** with bcryptjs (10-round salt)
- **Role-Based Access Control** (User/Admin separation)
- **CORS Protection** with whitelisted origins
- **Secure Cookies** with HTTPOnly and SameSite flags
- **File Upload Validation** via Multer
- **Server-Side Input Validation** across all endpoints

## � Future Enhancements

- Payment gateway integration (Stripe/Razorpay)
- Email/SMS notifications & OTP verification
- Admin analytics dashboard
- Guest reviews & ratings system
- Loyalty & rewards program
- Real-time updates (WebSocket)
- Multi-language support
- Mobile app (iOS/Android)

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make your changes with clear commit messages
4. Push and open a Pull Request

**Standards:** 2-space indentation, descriptive commits, add comments for complex logic.

## 📄 License

ISC License - See individual package.json files for details.

---

**Questions?** Create an issue or reach out to the development team.
