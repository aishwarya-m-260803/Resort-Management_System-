# Resort Management System

A web-based application to manage resort operations such as bookings, customer details, and services.

## Features
- User booking system
- Admin panel
- Customer management
- Room/service management

## Tech Stack
- Node.js
- Express.js
- React.js
- MongoDB
- HTML, CSS, JavaScript

## Installation Steps

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/resort-management-system.git
cd resort-management-system
```

### 2. Install Dependencies
#### Backend
```bash
cd backend
npm install
```
#### Frontend
```bash
cd ../frontend
npm install
```

### 3. Set Up the Database (MongoDB)
- Ensure MongoDB is installed and running locally or provide a MongoDB Atlas connection string.
- Update the MongoDB connection URI in `backend/config/db.js` if needed.

### 4. Run the Project Locally
#### Start Backend Server
```bash
cd backend
npm start
```
#### Start Frontend Server
```bash
cd ../frontend
npm start
```

## Usage Instructions
- Access the frontend at `http://localhost:3000`.
- Use the application to register, log in, book rooms/services, and manage resort operations.
- Admins can log in to access the admin panel for management features.

## Folder Structure
```
resort-management-system/
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── ...
├── frontend/
│   ├── public/
│   ├── src/
│   └── ...
└── README.md
```

## Future Improvements
- Add payment gateway integration
- Implement notifications (email/SMS)
- Add analytics dashboard for admins
- Enhance UI/UX

## Author
- Aishwarya M
