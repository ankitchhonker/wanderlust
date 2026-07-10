# Wanderlust – Travelers App (React + Node/Express)

 
---

## Project Structure

```
travelers-react/
├── backend/        ← Express REST API (Node.js)
│   ├── server.js
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── config/
│   └── utils/
└── frontend/       ← React app (Vite)
    └── src/
        ├── api/
        ├── components/
        ├── context/
        └── pages/
```

---

## Setup

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env   # Fill in your values
npm run dev            # Starts on http://localhost:8080
```

**Required `.env` values:**

| Key | Where to get |
|-----|-------------|
| `ATLASDB_URL` | MongoDB Atlas connection string |
| `SECRET` | Any random string for sessions |
| `CLOUD_NAME` | Cloudinary dashboard |
| `CLOUD_API_KEY` | Cloudinary dashboard |
| `CLOUD_API_SECRET` | Cloudinary dashboard |
| `MAP_TOKEN` | Mapbox account (public token) |
| `GEMINI_API_KEY` | Google AI Studio |
| `CLIENT_URL` | `http://localhost:5173` (for dev) |

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env   # Add your Mapbox public token
npm run dev            # Starts on http://localhost:5173
```

**Required `.env` value:**

```
VITE_MAP_TOKEN=pk.eyJ1...   (your Mapbox PUBLIC token)
```

---

## Features

- ✅ Browse all listings with category filters
- ✅ Search by title, location, country, category
- ✅ View listing details with Mapbox map
- ✅ Create / Edit / Delete listings (owner only)
- ✅ Cloudinary image upload
- ✅ Add / Delete reviews with star ratings
- ✅ User auth — Sign up, Login, Logout (Passport.js)
- ✅ ✨ AI description generator (Gemini API)
- ✅ GST tax toggle
- ✅ Sticky price card on listing detail
- ✅ Mobile responsive

---

## API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/listings` | — | All listings |
| GET | `/api/listings/category/:cat` | — | Filter by category |
| GET | `/api/listings/search?searchTerm=` | — | Search |
| POST | `/api/listings` | ✅ | Create listing |
| GET | `/api/listings/:id` | — | Listing detail |
| PUT | `/api/listings/:id` | ✅ owner | Update listing |
| DELETE | `/api/listings/:id` | ✅ owner | Delete listing |
| POST | `/api/listings/:id/reviews` | ✅ | Add review |
| DELETE | `/api/listings/:id/reviews/:rid` | ✅ author | Delete review |
| POST | `/api/users/signup` | — | Register |
| POST | `/api/users/login` | — | Login |
| POST | `/api/users/logout` | — | Logout |
| GET | `/api/users/me` | — | Current user |
| POST | `/api/generate-description` | ✅ | AI description |
