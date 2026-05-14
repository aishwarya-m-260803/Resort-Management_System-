#  Resort Management System

A full-stack web application that streamlines resort operations by enabling seamless bookings for guests and efficient management for administrators.

---

##  Features

###  Guest

* User authentication (JWT-based)
* Browse and book rooms (Standard, Deluxe, Suite, Villa)
* Explore and register for activities
* Reserve dining experiences
* Manage bookings and profile
* Smooth and responsive UI

---

###  Admin

* Dashboard for overall management
* Manage rooms, bookings, activities, and dining
* Monitor and control user accounts

---

##  Tech Stack

* **Frontend:** React.js, React Router, Framer Motion
* **Backend:** Node.js, Express.js
* **Database:** MongoDB (Mongoose)
* **Auth & Security:** JWT, bcrypt

> MongoDB is used for its flexible, document-based structure, making it ideal for handling dynamic data like bookings, activities, and user information.

---

##  Installation

```bash
git clone https://github.com/your-username/resort-management-system.git
cd resort-management-system
npm run install-all
```

Create `.env` in `backend/`:

```env
MONGO_URI=your_mongodb_connection
PORT=5000
SESSION_SECRET=your_secret
```

Run the app:

```bash
npm run dev
```

---

##  Structure

```
backend/   → APIs, models, controllers  
frontend/  → UI components, pages  
```

---

##  API

* `/api/auth` → Authentication
* `/api/rooms` → Rooms
* `/api/activities` → Activities
* `/api/bookings` → Bookings
* `/api/admin` → Admin operations


---

## Future Improvements

* Payment integration
* Notifications (Email/SMS)
* Reviews & ratings
* Real-time updates

---

Author
Aishwarya M
