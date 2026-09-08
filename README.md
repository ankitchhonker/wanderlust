<div align="center">
  <img src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1200&q=80" alt="Wanderlust Banner" width="100%" style="border-radius: 12px; margin-bottom: 20px;" />
  
  <h1>Wanderlust (Travelers App)</h1>
  <p><strong>A modern, full-stack Airbnb clone built with the MERN stack.</strong></p>

  <p>
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
    <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
    <img src="https://img.shields.io/badge/Express.js-404D59?style=for-the-badge" alt="Express" />
    <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  </p>
</div>

<br />

## About The Project

Wanderlust is a fully-featured travel property booking platform that connects hosts with travelers. Engineered with a scalable **MERN (MongoDB, Express, React, Node.js)** architecture, it handles everything from secure session-based authentication to real-time property reservations and interactive mapping.

This project was built to demonstrate proficiency in full-stack web development, API design, database modeling, and third-party API integration.

### Key Features

- **Robust Authentication:** Secure, session-based user authentication using **Passport.js** (Local Strategy) and `express-session`, stored persistently in MongoDB.
- **Booking & Reservation System:** Complete end-to-end booking flow with dynamic date-range calculations (Check-in/Check-out) and total price computation including taxes.
- **AI-Powered Descriptions:** Integrated with the **Google Gemini (Generative AI) API** to automatically generate catchy, SEO-friendly property descriptions for hosts with a single click.
- **Interactive Geospatial Maps:** Leveraged **Mapbox GL JS** and the Mapbox Geocoding API to plot properties dynamically on interactive maps based on address input.
- **Advanced Media Handling:** Integrated **Cloudinary** and `multer` for optimized, secure, and scalable cloud image hosting.
- **RESTful API & Database:** Designed a robust API with Express, utilizing **Mongoose** for complex relational data modeling (Users, Listings, Reviews, Bookings).
- **Modern Frontend UX:** Built a sleek, responsive Single Page Application (SPA) using **React (Vite)**, React Router, and a custom CSS design system. Implemented API-driven server-side pagination and real-time search filtering.
- Optimize API for getting faster response.

---

## Tech Stack

### Frontend
- **React.js** (Bootstrapped with Vite for instant server start)
- **React Router Dom** (Client-side routing)
- **Context API** (Global state management)
- **Axios** (API communication)
- **Mapbox GL** (Interactive maps)
- **React Hot Toast** (UX notifications)

### Backend
- **Node.js & Express.js** (REST API architecture)
- **MongoDB & Mongoose** (NoSQL Database & Object Data Modeling)
- **Passport.js** (Authentication & Authorization)
- **Joi** (Server-side schema validation)

### Cloud & 3rd Party Services
- **Cloudinary** (Image storage & CDN)
- **Mapbox API** (Forward Geocoding)
- **Google Gemini 2.5 Flash** (Generative AI)

---

## Project Architecture

```
travelers-react/
├── backend/                  ← Express REST API
│   ├── controllers/          # Business logic (Bookings, Listings, Users)
│   ├── models/               # Mongoose Schemas (User, Listing, Review, Booking)
│   ├── routes/               # API endpoints
│   ├── middleware/           # Auth checks & Error handlers
│   └── server.js             # Entry point & DB connection
│
└── frontend/                 ← React Client
    └── src/
        ├── api/              # Axios API helper functions
        ├── components/       # Reusable UI components (Navbar, Modals, Cards)
        ├── context/          # React Context (AuthContext)
        └── pages/            # View components (Home, Profile, ListingShow)
```

---

## Local Setup & Installation

To run this project locally, you will need Node.js installed on your machine.

### 1. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:
```env
ATLASDB_URL=<Your MongoDB Connection String>
SECRET=<Your Session Secret>
CLOUD_NAME=<Cloudinary Cloud Name>
CLOUD_API_KEY=<Cloudinary API Key>
CLOUD_API_SECRET=<Cloudinary API Secret>
MAP_TOKEN=<Mapbox Public Token>
GEMINI_API_KEY=<Google AI Studio Key>
CLIENT_URL=http://localhost:5173
```

Start the backend server:
```bash
npm run dev
# Server will start on http://localhost:8080
```

### 2. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend/` directory:
```env
VITE_MAP_TOKEN=<Your Mapbox Public Token>
```

Start the development server:
```bash
npm run dev
# Client will start on http://localhost:5173
```

---

## Database Models Overview

- **User:** Handles authentication credentials and profile data.
- **Listing:** Contains property details (title, price, geometry, owner reference, array of review references).
- **Review:** Contains a rating (1-5), comment string, and author reference.
- **Booking:** Links a `User` to a `Listing` along with `checkIn`, `checkOut`, and computed `totalPrice`.

---

<div align="center">
  <i>If you are a recruiter reviewing this project, feel free to reach out to discuss the architecture, design decisions, or my experience building this!</i>
</div>
