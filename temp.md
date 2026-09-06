# Wanderlust — Deep Dive Interview Preparation Guide
### A First-Principles Engineering Analysis of a Full-Stack MERN Application

---

# TABLE OF CONTENTS

1. [The Big Picture — System Architecture](#1-the-big-picture)
2. [Why MERN Stack? (vs Alternatives)](#2-why-mern-stack)
3. [Express.js — The Backend Engine](#3-expressjs-the-backend-engine)
4. [MongoDB & Mongoose — Database Layer](#4-mongodb--mongoose)
5. [Authentication — Sessions, Cookies & Passport.js](#5-authentication)
6. [Authorization — Middleware & Access Control](#6-authorization)
7. [Image Uploads — Multer & Cloudinary](#7-image-uploads)
8. [Geospatial Data — Mapbox & GeoJSON](#8-geospatial-data)
9. [AI Integration — Google Gemini](#9-ai-integration)
10. [React Frontend — Component Architecture](#10-react-frontend)
11. [Axios vs Fetch — HTTP Client Decision](#11-axios-vs-fetch)
12. [State Management — Context API](#12-state-management)
13. [React Router — Client-Side Routing](#13-react-router)
14. [Pagination — Server-Side Implementation](#14-pagination)
15. [Watchlist — Atomic Database Operations](#15-watchlist)
16. [Booking System — Data Modeling](#16-booking-system)
17. [CORS — Cross-Origin Resource Sharing](#17-cors)
18. [Deployment Architecture — Vercel + Render](#18-deployment)
19. [Error Handling Patterns](#19-error-handling)
20. [Vite vs Create React App](#20-vite-vs-cra)
21. [Environment Variables & Security](#21-environment-variables)
22. [RESTful API Design Principles](#22-restful-api-design)
23. [Practice Questions](#23-practice-questions)

---

# 1. THE BIG PICTURE

## What is this application?

Wanderlust is a full-stack property rental platform (similar to Airbnb). It allows users to browse travel properties, book stays, leave reviews, save favorites, and manage their profiles.

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                      BROWSER (Client)                   │
│  React 18 + Vite + React Router + Axios + Mapbox GL JS  │
│        Deployed on: Vercel (Static CDN)                 │
└──────────────────────┬──────────────────────────────────┘
                       │  HTTP Requests (JSON)
                       │  Session Cookie (HttpOnly)
                       ▼
┌─────────────────────────────────────────────────────────┐
│                  EXPRESS.js SERVER (API)                 │
│  Node.js + Passport.js + Multer + Mongoose + Joi        │
│        Deployed on: Render (Web Service)                │
└───┬──────────┬──────────┬──────────┬────────────────────┘
    │          │          │          │
    ▼          ▼          ▼          ▼
┌────────┐ ┌────────┐ ┌────────┐ ┌─────────────┐
│MongoDB │ │Cloudi- │ │Mapbox  │ │Google Gemini│
│ Atlas  │ │ nary   │ │  API   │ │     AI      │
│(Data)  │ │(Images)│ │(Maps)  │ │(Descriptions)│
└────────┘ └────────┘ └────────┘ └─────────────┘
```

## How Does a Request Flow Through the System?

Let us trace what happens when a user clicks on a property listing:

```
1. User clicks a listing card in the browser
2. React Router changes URL to /listings/abc123
3. ListingShow.jsx component mounts
4. useEffect() fires and calls fetchListing("abc123")
5. Axios sends GET request to /api/listings/abc123
6. Browser automatically attaches the session cookie
7. Vite dev server proxies the request to localhost:8080
8. Express receives the request
9. It runs through middleware: cors → json parser → session → passport
10. Route matches: router.get("/:id", listingController.showListing)
11. Controller calls Listings.findById(id).populate("reviews").populate("owner")
12. Mongoose sends the query to MongoDB Atlas
13. MongoDB returns the document with populated references
14. Controller sends JSON response back to the browser
15. Axios resolves the promise
16. React state updates via setListing(res.data.listing)
17. Component re-renders with the listing data
18. Mapbox GL JS renders the map with the listing's coordinates
```

This is the mental model you should carry into your interview. Every feature follows this exact pattern: **User Action → React State → Axios HTTP Call → Express Middleware → Controller Logic → Mongoose Query → MongoDB → Response → React Re-render**.

---

# 2. WHY MERN STACK?

## What is MERN?

MERN stands for MongoDB, Express.js, React, and Node.js. It is a JavaScript-based full-stack technology combination.

## Why This Stack Over Alternatives?

### JavaScript Everywhere (The Core Advantage)

The single biggest advantage of MERN is that you write JavaScript on the frontend AND the backend. This means:
- One language to learn, debug, and think in
- You can share validation logic between client and server
- JSON (JavaScript Object Notation) flows natively between all layers without transformation

### MongoDB vs SQL Databases (PostgreSQL, MySQL)

| Factor | MongoDB (NoSQL) | PostgreSQL (SQL) |
|--------|----------------|------------------|
| Data Format | JSON-like documents (BSON) | Rows and columns (tables) |
| Schema | Flexible — fields can vary per document | Rigid — must define all columns upfront |
| Relationships | References (ObjectId) or Embedding | Foreign keys with JOIN operations |
| Scaling | Horizontal (add more servers easily) | Vertical (make server bigger) |
| Best For | Rapidly changing schemas, nested data | Complex relationships, transactions |

**Why MongoDB for Wanderlust?**

A property listing has nested, variable data. One listing might have 10 reviews, another might have zero. One listing might have coordinates, another might not. MongoDB's flexible document structure handles this naturally without needing to create JOIN tables or deal with NULL columns.

Consider how a Listing document looks in MongoDB:
```json
{
  "_id": "66937082...",
  "title": "Modern Loft in Downtown",
  "price": 12000,
  "image": { "url": "https://cloudinary...", "filename": "abc" },
  "geometry": { "type": "Point", "coordinates": [77.1, 31.7] },
  "reviews": ["ObjectId1", "ObjectId2"],
  "owner": "ObjectId3"
}
```

In SQL, you would need at LEAST 4 tables (listings, images, geometries, listing_reviews junction table) and multiple JOINs to reconstruct this same data. MongoDB stores it as a single, intuitive document.

### Express.js vs Alternatives (Fastify, Koa, NestJS)

| Factor | Express.js | Fastify | NestJS |
|--------|-----------|---------|--------|
| Learning Curve | Very Low | Low | High (TypeScript, Decorators) |
| Ecosystem | Largest (most middleware available) | Growing | Large but opinionated |
| Performance | Good | Faster (claims 2x) | Good (built on Express/Fastify) |
| Community | 60k+ GitHub stars, battle-tested | 30k+ stars | 60k+ stars |
| Flexibility | Minimalist — you choose everything | Minimalist with schema validation | Opinionated — Angular-like structure |

**Why Express for Wanderlust?**

Express is the industry standard for Node.js web servers. It has the largest middleware ecosystem (Passport.js, Multer, CORS, express-session all work out of the box). For an intern-level project, Express demonstrates understanding of fundamental HTTP concepts without hiding them behind abstraction layers like NestJS does.

### React vs Alternatives (Vue, Angular, Svelte)

| Factor | React | Vue | Angular | Svelte |
|--------|-------|-----|---------|--------|
| Architecture | Library (UI only) | Progressive Framework | Full Framework | Compiler |
| Learning Curve | Medium | Low | High | Low |
| State Management | Context, Redux, Zustand | Vuex, Pinia | RxJS, NgRx | Stores |
| Job Market | Highest demand | Growing | Enterprise-heavy | Niche |
| Bundle Size | ~42KB | ~33KB | ~143KB | ~1.6KB (compiled) |

**Why React for Wanderlust?**

React has the largest job market demand. It teaches you fundamental concepts like component thinking, state management, and the virtual DOM that transfer to any other framework. React's component model (functional components + hooks) is the most widely adopted pattern in modern frontend development.

---

# 3. EXPRESS.js — THE BACKEND ENGINE

## What is Express.js at a Low Level?

Express.js is a thin wrapper around Node.js's built-in `http` module. At its core, Node.js can create an HTTP server like this:

```javascript
// Pure Node.js (without Express)
const http = require('http');
const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/api/listings') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ listings: [] }));
  }
});
server.listen(8080);
```

This works, but it is painful. You have to manually parse URLs, handle HTTP methods, parse JSON bodies, manage cookies, etc. Express abstracts all of this:

```javascript
// With Express
const express = require('express');
const app = express();
app.use(express.json()); // Automatically parses JSON bodies
app.get('/api/listings', (req, res) => {
  res.json({ listings: [] }); // Automatically sets Content-Type header
});
app.listen(8080);
```

## The Middleware Pipeline (Critical Concept)

The most important concept in Express is the **middleware pipeline**. When a request arrives, it passes through a chain of functions, one after another. Each function can:
1. **Modify the request** (e.g., parse JSON body, attach user info)
2. **End the response** (e.g., send an error)
3. **Call `next()`** to pass control to the next middleware

Here is how YOUR server.js middleware pipeline works:

```
Incoming Request
      │
      ▼
┌─────────────┐
│    CORS     │  ← Checks if the request origin is allowed
│ middleware  │     If not: blocks the request
└──────┬──────┘
       ▼
┌─────────────┐
│ express.json│  ← Parses the raw request body string into req.body object
│  parser     │     e.g., '{"username":"john"}' → req.body.username === "john"
└──────┬──────┘
       ▼
┌─────────────┐
│  express-   │  ← Reads the session cookie from the request
│  session    │     Looks up the session ID in MongoDB (MongoStore)
│             │     Attaches session data to req.session
└──────┬──────┘
       ▼
┌─────────────┐
│  passport.  │  ← Initializes Passport on this request
│ initialize()│
└──────┬──────┘
       ▼
┌─────────────┐
│  passport.  │  ← Reads the user ID from the session
│  session()  │     Calls deserializeUser() to load the full user from MongoDB
│             │     Attaches the user object to req.user
└──────┬──────┘
       ▼
┌─────────────┐
│   ROUTE     │  ← Matches the URL and HTTP method
│  HANDLER    │     Executes the controller function
└──────┬──────┘
       ▼
┌─────────────┐
│   ERROR     │  ← Catches any errors thrown above
│  HANDLER    │     Sends formatted JSON error response
└─────────────┘
```

**Interview Tip:** If an interviewer asks "What is middleware?", you should say: "Middleware is a function that has access to the request object, response object, and the next function. It can execute code, modify req/res, end the request-response cycle, or call next() to pass control to the next middleware in the stack."

## What does `next()` Actually Do?

```javascript
module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: "You must be logged in" });
    // We return here and NEVER call next(), so the request stops.
  }
  next(); // This passes control to the NEXT middleware or route handler
};
```

If `next()` is not called, the request hangs forever (the client never receives a response and eventually times out). This is one of the most common bugs in Express applications.

---

# 4. MongoDB & Mongoose

## What is Mongoose and Why Do We Need It?

MongoDB's native Node.js driver lets you interact with the database, but it provides no structure or validation. Mongoose is an ODM (Object Data Modeling) library that adds:

1. **Schema Definition** — Define the shape of your documents
2. **Validation** — Ensure required fields exist, types are correct
3. **Middleware (Hooks)** — Run code before/after save, delete, etc.
4. **Population** — Resolve ObjectId references into full documents
5. **Query Building** — Chainable, readable query API

### Mongoose vs Native MongoDB Driver

```javascript
// Native MongoDB Driver (No Mongoose)
const { MongoClient } = require('mongodb');
const client = new MongoClient(uri);
const db = client.db('wanderlust');
const result = await db.collection('listings').insertOne({
  title: 123,          // OOPS! This should be a string, but MongoDB doesn't care
  price: "not a number" // OOPS! This should be a number, but MongoDB accepts it
});

// With Mongoose
const listSchema = new Schema({
  title: { type: String, required: true },   // Will throw error if missing or wrong type
  price: { type: Number, required: true },   // Will throw error if "not a number" is passed
});
const Listing = mongoose.model('Listings', listSchema);
await Listing.create({ title: 123, price: "bad" }); // THROWS VALIDATION ERROR
```

## Schema Design — Embedding vs Referencing

This is the most frequently asked MongoDB interview question.

### Embedding (Storing data directly inside the parent document)

```javascript
// Embedded approach (NOT what we use for reviews)
const listingSchema = new Schema({
  title: String,
  reviews: [
    {
      rating: Number,
      comment: String,
      author: String,
      createdAt: Date
    }
  ]
});
```

**Pros:** Single query fetches everything. Very fast reads.
**Cons:** If a listing gets 10,000 reviews, the document becomes enormous. MongoDB has a 16MB document size limit. You also cannot query reviews independently.

### Referencing (Storing ObjectIds that point to other collections)

```javascript
// Referenced approach (WHAT WE ACTUALLY USE)
const listingSchema = new Schema({
  title: String,
  reviews: [{ type: Schema.Types.ObjectId, ref: "Reviews" }], // Just stores IDs
  owner: { type: Schema.Types.ObjectId, ref: "User" }
});
```

**Pros:** Documents stay small. Reviews can be queried independently. No 16MB limit risk.
**Cons:** Requires an extra database query (`.populate()`) to resolve the references.

### What `.populate()` Actually Does Under the Hood

When you write:
```javascript
const listing = await Listings.findById(id)
  .populate({ path: "reviews", populate: { path: "author" } })
  .populate("owner");
```

Mongoose internally executes something like:
```
Step 1: db.listings.findOne({ _id: id })
        → Returns document with reviews: ["id1", "id2"] and owner: "id3"

Step 2: db.reviews.find({ _id: { $in: ["id1", "id2"] } })
        → Returns the actual review documents

Step 3: For each review, db.users.findOne({ _id: review.author })
        → Returns the author's user document

Step 4: db.users.findOne({ _id: "id3" })
        → Returns the owner's user document

Step 5: Mongoose stitches all results together into one nested object
```

This is called a "nested populate" or "deep populate." It is analogous to a multi-table JOIN in SQL, but executed as separate queries.

### Why Watchlist is Stored Differently (Inside the User Document)

```javascript
// In User model
const userSchema = new Schema({
  username: String,
  email: String,
  watchlist: [{ type: Schema.Types.ObjectId, ref: "Listings" }]
});
```

The watchlist is an array of ObjectIds stored INSIDE the User document because:

1. **Access Pattern:** When a user logs in, we need their watchlist INSTANTLY to render heart icons on every listing card. If watchlists were in a separate collection, we would need an extra database query on every page load.
2. **Size Constraint:** A user realistically saves 10-100 properties. An array of 100 ObjectIds uses approximately 2.4KB — trivially small compared to MongoDB's 16MB document limit.
3. **Ownership:** A watchlist belongs exclusively to ONE user. There is no scenario where you need to query "which users saved this listing?" (unlike reviews, which need to be queried per listing).

---

# 5. AUTHENTICATION — Sessions, Cookies & Passport.js

## How Does Session-Based Authentication Work? (First Principles)

### Step 1: User Logs In

```
Browser                           Server                        MongoDB
  │                                 │                              │
  │  POST /api/users/login          │                              │
  │  Body: {username, password}     │                              │
  │ ───────────────────────────────>│                              │
  │                                 │  passport.authenticate()     │
  │                                 │  Finds user by username      │
  │                                 │──────────────────────────────>│
  │                                 │  Returns user document       │
  │                                 │<──────────────────────────────│
  │                                 │                              │
  │                                 │  Compares password hash      │
  │                                 │  using PBKDF2 algorithm      │
  │                                 │                              │
  │                                 │  Creates session:            │
  │                                 │  { sid: "abc123",            │
  │                                 │    user: "userId" }          │
  │                                 │──────────────────────────────>│
  │                                 │  Saves session to MongoDB    │
  │                                 │                              │
  │  Response: 200 OK               │                              │
  │  Set-Cookie: connect.sid=abc123 │                              │
  │  (HttpOnly, Secure, SameSite)   │                              │
  │ <───────────────────────────────│                              │
  │                                 │                              │
  │  Browser automatically stores   │                              │
  │  the cookie. JavaScript CANNOT  │                              │
  │  read it (HttpOnly flag).       │                              │
```

### Step 2: Subsequent Requests (User is Now "Logged In")

```
Browser                           Server                        MongoDB
  │                                 │                              │
  │  GET /api/listings              │                              │
  │  Cookie: connect.sid=abc123     │  (browser sends automatically)
  │ ───────────────────────────────>│                              │
  │                                 │  express-session reads       │
  │                                 │  cookie value "abc123"       │
  │                                 │──────────────────────────────>│
  │                                 │  Finds session in sessions   │
  │                                 │  collection by sid           │
  │                                 │<──────────────────────────────│
  │                                 │                              │
  │                                 │  passport.deserializeUser()  │
  │                                 │  Loads full user from User   │
  │                                 │  collection using session's  │
  │                                 │  stored userId               │
  │                                 │                              │
  │                                 │  Attaches to req.user        │
  │                                 │                              │
  │                                 │  Now isLoggedIn middleware   │
  │                                 │  can check req.isAuthenticated()
```

### Step 3: Logout

```
Browser                           Server                        MongoDB
  │                                 │                              │
  │  POST /api/users/logout         │                              │
  │ ───────────────────────────────>│                              │
  │                                 │  req.logOut() is called      │
  │                                 │  Destroys session from       │
  │                                 │  MongoDB sessions collection │
  │                                 │──────────────────────────────>│
  │                                 │                              │
  │  Response: Set-Cookie with      │                              │
  │  expired date (clears cookie)   │                              │
  │ <───────────────────────────────│                              │
```

## Sessions vs JWT — A Deep Comparison

| Aspect | Sessions (What We Use) | JWT (JSON Web Tokens) |
|--------|----------------------|----------------------|
| **Where is auth data stored?** | Server-side (in MongoDB via connect-mongo) | Client-side (in localStorage or cookie) |
| **What does the browser hold?** | A meaningless session ID string | The entire token containing user data |
| **Can the server instantly revoke access?** | YES — delete the session from MongoDB | NO — token is valid until it expires |
| **Vulnerable to XSS?** | NO — HttpOnly cookie cannot be read by JS | YES — if stored in localStorage, any XSS script can steal it |
| **Requires database lookup per request?** | YES — must look up session in MongoDB | NO — token is self-validating (contains a signature) |
| **Scales across multiple servers?** | YES (if sessions are in shared DB like MongoDB) | YES (stateless, no shared storage needed) |
| **Best for** | Web applications with browsers | Mobile apps, microservices, public APIs |

**Why Sessions for Wanderlust?**

1. **Security:** Our session cookie has `httpOnly: true`, which means even if an attacker injects a malicious script (XSS), they physically cannot read the cookie. With JWT in localStorage, a single XSS vulnerability exposes the entire token.

2. **Instant Revocation:** If a user reports their account as compromised, we delete their session from MongoDB. They are immediately logged out everywhere. With JWT, we would have to wait for the token to expire (or build a complex token blacklist system, which defeats the purpose of JWT being stateless).

3. **connect-mongo solves the scaling problem:** The traditional argument against sessions is that they do not scale across multiple servers because each server has its own memory. But we store sessions in MongoDB (shared database), so 10 servers can all validate the same session.

## What is `passport-local-mongoose`?

This plugin automatically adds the following to your User model:
- `hash` field — The password hash (NOT the plain password)
- `salt` field — A random value used to make identical passwords produce different hashes
- `User.register(user, password)` — Hashes the password and saves the user
- `User.authenticate()` — Returns a Passport strategy that validates credentials
- `User.serializeUser()` — Tells Passport how to store user info in the session
- `User.deserializeUser()` — Tells Passport how to retrieve user info from the session

**Why is this important?** You NEVER store plain text passwords. The password "MySecret123" gets transformed into something like `"pbkdf2$10000$abc123salt$8f3a9b2c..."` which is impossible to reverse.

## Cookie Configuration Deep Dive

```javascript
cookie: {
  maxAge: 7 * 24 * 60 * 60 * 1000,  // Cookie expires in 7 days (in milliseconds)
  httpOnly: true,                     // JavaScript cannot access this cookie
  sameSite: process.env.NODE_ENV === "PRODUCTION" ? "none" : "lax",
  secure: process.env.NODE_ENV === "PRODUCTION",
}
```

- **`httpOnly: true`** — The cookie is invisible to `document.cookie` in JavaScript. Only the browser's HTTP engine can read and send it. This is the #1 defense against XSS token theft.
- **`sameSite: "lax"`** — In development, cookies are only sent for same-site requests. This prevents CSRF attacks.
- **`sameSite: "none"` + `secure: true`** — In production, since our frontend (vercel.app) and backend (onrender.com) are on different domains, we MUST set sameSite to "none" (otherwise the browser blocks the cookie). But "none" requires `secure: true`, meaning cookies only work over HTTPS.

---

# 6. AUTHORIZATION — Middleware & Access Control

## Authentication vs Authorization

- **Authentication:** "Who are you?" → Verifying identity (login/signup)
- **Authorization:** "What are you allowed to do?" → Checking permissions

## The Three Authorization Middlewares

### 1. `isLoggedIn` — Are You Authenticated?

```javascript
module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: "You must be logged in" });
  }
  next();
};
```

`req.isAuthenticated()` is a method added by Passport. It returns `true` if `req.user` exists (meaning the session was valid and the user was deserialized).

HTTP Status `401 Unauthorized` means "you need to prove who you are first."

### 2. `isOwner` — Do You Own This Listing?

```javascript
module.exports.isOwner = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing.owner._id.equals(req.user._id)) {
    return res.status(403).json({ error: "You don't have permission" });
  }
  next();
};
```

HTTP Status `403 Forbidden` means "I know who you are, but you are not allowed to do this."

**Why `.equals()` instead of `===`?**

MongoDB ObjectIds are objects, not primitive strings. Two different ObjectId objects with the same value are NOT equal with `===`:

```javascript
const id1 = new ObjectId("abc123");
const id2 = new ObjectId("abc123");
id1 === id2;      // false (different object references)
id1.equals(id2);  // true (compares the actual ID values)
```

### 3. `isAuthor` — Did You Write This Review?

Same pattern as `isOwner`, but for reviews. Ensures users can only delete their own reviews.

## How Middlewares Chain Together in Routes

```javascript
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));
```

This creates a pipeline:
```
Request → isLoggedIn → isOwner → deleteListing
              │             │
              │             └── If not owner: 403 (stops here)
              │
              └── If not logged in: 401 (stops here)
```

Only if ALL middlewares call `next()` does the final controller execute.

---

# 7. IMAGE UPLOADS — Multer & Cloudinary

## The Problem: Why Not Store Images in MongoDB?

MongoDB has a 16MB document size limit. A single high-resolution photo can be 5-10MB. Storing images as binary data in MongoDB would:
1. Bloat the database
2. Make queries slow (every listing query would download megabytes of image data)
3. Hit the 16MB limit with just 2-3 images per listing

## The Solution: Cloud Storage (Cloudinary)

Instead of storing the image itself, we store only the **URL string** in MongoDB:

```javascript
image: {
  url: "https://res.cloudinary.com/your-cloud/image/upload/v1234/wanderlust/abc.jpg",
  filename: "wanderlust/abc"
}
```

The actual image binary lives on Cloudinary's CDN (Content Delivery Network), which:
- Serves images from servers closest to the user (fast)
- Automatically optimizes image quality and format
- Handles resizing on-the-fly via URL parameters
- Provides unlimited storage

## How the Upload Pipeline Works

```
1. User selects an image file in the browser
2. Browser creates a FormData object (multipart/form-data encoding)
3. Axios sends POST request with the file
4. Express receives the request
5. Multer middleware intercepts the multipart data
6. multer-storage-cloudinary STREAMS the file directly to Cloudinary
   (The file NEVER touches the server's disk)
7. Cloudinary processes and stores the image
8. Cloudinary returns a URL and filename
9. Multer attaches this info to req.file
10. Controller saves req.file.path (URL) to MongoDB
```

### Why `multer-storage-cloudinary` Instead of Saving Locally First?

```javascript
// BAD approach: Save to disk, then upload
const upload = multer({ dest: './uploads/' }); // Saves to server disk
// Then separately upload to Cloudinary
// Problem: Server disk fills up, doesn't work on serverless/containers

// GOOD approach: Stream directly to Cloudinary
const storage = new CloudinaryStorage({ cloudinary, params: { folder: 'wanderlust' } });
const upload = multer({ storage });
// File goes Browser → Server Memory → Cloudinary (never touches disk)
```

This is critical for deployment on platforms like Render, which use ephemeral filesystems. Files saved to disk are deleted when the server restarts.

---

# 8. GEOSPATIAL DATA — Mapbox & GeoJSON

## What is GeoJSON?

GeoJSON is a standardized format for encoding geographic data structures. MongoDB natively supports GeoJSON, which means you can:
- Store coordinates in a standard format
- Create geospatial indexes (`2dsphere`)
- Query for nearby locations (`$near`, `$geoWithin`)

```javascript
geometry: {
  type: { type: String, enum: ["Point"] },        // GeoJSON type
  coordinates: { type: [Number] },                 // [longitude, latitude]
}
```

**Critical Detail:** GeoJSON uses `[longitude, latitude]` order, NOT `[latitude, longitude]`. This is opposite to how Google Maps and most people think about coordinates. Getting this wrong is a very common bug.

## Forward Geocoding

When a user types "New York City" as the location, we use Mapbox's Geocoding API to convert that text into coordinates `[-74.006, 40.7128]`. This is called "forward geocoding" (address → coordinates). The reverse (coordinates → address) is called "reverse geocoding."

---

# 9. AI INTEGRATION — Google Gemini

## How It Works

```javascript
// Backend: controllers/generateController.js
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// We send a prompt with the property details and get back a description
const result = await model.generateContent(prompt);
```

## Why is the AI Call on the Backend (Not Frontend)?

1. **API Key Security:** If we called the Gemini API from the frontend, our API key would be visible in the browser's network tab. Anyone could steal it and use our quota. By calling it from the backend, the key stays in the `.env` file and never reaches the browser.

2. **Cost Control:** We can add rate limiting middleware on the backend to prevent abuse. If the AI call was on the frontend, a user could call it thousands of times by opening the browser console.

---

# 10. REACT FRONTEND — Component Architecture

## Why Functional Components + Hooks (Not Class Components)?

React historically used class components:

```javascript
// OLD: Class component (pre-2019)
class ListingCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = { liked: false };
  }
  componentDidMount() { /* fetch data */ }
  render() { return <div>{this.state.liked}</div> }
}

// MODERN: Functional component with hooks (what we use)
function ListingCard({ listing }) {
  const [liked, setLiked] = useState(false);
  useEffect(() => { /* fetch data */ }, []);
  return <div>{liked}</div>;
}
```

**Why hooks are better:**
- Less boilerplate code (no constructor, no `this` binding)
- Logic can be extracted into custom hooks (reusable)
- Easier to read and test
- React team recommends hooks for all new code

## The Key React Hooks Used in This Project

### `useState` — Managing Local Component State

```javascript
const [listings, setListings] = useState([])  // Initial value: empty array
const [loading, setLoading] = useState(true)   // Initial value: true
const [page, setPage] = useState(1)            // Initial value: 1
```

When you call `setListings(newData)`, React:
1. Updates the state value
2. Schedules a re-render of the component
3. The component function runs again with the new state
4. React compares the old and new virtual DOM (diffing)
5. Only the changed DOM elements are updated (reconciliation)

### `useEffect` — Side Effects (Data Fetching, Subscriptions)

```javascript
useEffect(() => {
  fetchListings(page)
    .then(res => setListings(res.data.listings))
}, [page])  // ← Dependency array
```

The dependency array `[page]` means: "Run this effect whenever `page` changes." If you pass `[]`, it runs once on mount. If you omit it entirely, it runs on every render (usually a bug).

### `useContext` — Consuming Global State

```javascript
const { user, setUser } = useAuth()  // Reads from AuthContext
```

This avoids "prop drilling" — passing user data through 10 levels of components.

---

# 11. AXIOS VS FETCH — HTTP CLIENT DECISION

## Why Axios Over the Browser's Built-in `fetch`?

This is one of the most commonly asked interview questions about frontend decisions.

### Feature Comparison

| Feature | Axios | fetch (built-in) |
|---------|-------|-------------------|
| Automatic JSON parsing | YES — `res.data` is already parsed | NO — must call `res.json()` manually |
| Request/Response interceptors | YES — can globally add auth headers | NO — must wrap every call manually |
| Base URL configuration | YES — set once, reuse everywhere | NO — must repeat full URL every time |
| Automatic cookie sending | YES — `withCredentials: true` | YES — `credentials: 'include'` |
| Error handling | Throws error on 4xx/5xx status codes | Does NOT throw on 4xx/5xx (only network errors) |
| Request cancellation | YES — AbortController support built-in | YES — AbortController |
| Upload progress | YES — `onUploadProgress` callback | NO — must use XMLHttpRequest |
| Browser support | All browsers + Node.js | Modern browsers only |

### The Most Important Difference: Error Handling

```javascript
// fetch — DANGEROUS: This code silently succeeds even on 404 or 500 errors
const response = await fetch('/api/listings/invalid-id');
// response.ok === false, but NO error is thrown!
// You must manually check:
if (!response.ok) throw new Error('Request failed');
const data = await response.json();

// Axios — SAFE: Automatically throws an error on 4xx/5xx
try {
  const response = await axios.get('/api/listings/invalid-id');
} catch (error) {
  // This catch block AUTOMATICALLY fires for 404, 500, etc.
  console.log(error.response.status);  // 404
  console.log(error.response.data);    // { error: "Listing not found" }
}
```

### How Our Axios Instance is Configured

```javascript
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
})
```

- **`baseURL`**: Every request automatically prepends this. So `api.get('/listings')` actually calls `/api/listings`. In production, it uses the Render URL. In development, it uses `/api` which Vite proxies to localhost:8080.
- **`withCredentials: true`**: Tells the browser to include cookies with every cross-origin request. Without this, session cookies would NOT be sent to a different domain (Render backend).

---

# 12. STATE MANAGEMENT — Context API

## Why Context API (Not Redux, Zustand, or Jotai)?

| Solution | Complexity | Best For | Boilerplate |
|----------|-----------|----------|-------------|
| Context API | Low | Small/medium apps, simple global state | Minimal |
| Redux | High | Large apps with complex state logic | Heavy (actions, reducers, store) |
| Zustand | Low | Medium apps wanting simplicity | Minimal |
| Jotai | Low | Atomic state management | Minimal |

**Why Context for Wanderlust?**

We only have ONE piece of truly global state: the authenticated user object. Context API handles this perfectly. Redux would be overkill — you would write 3x more code (action creators, reducers, store configuration, Provider wrappers) just to manage a single `user` object.

**When WOULD you upgrade to Redux?**

If the app grew to include real-time notifications, a shopping cart, multi-step forms, optimistic updates, and undo/redo functionality — then a dedicated state management library would be justified.

## How AuthContext Works End-to-End

```javascript
// 1. PROVIDER wraps the entire app (in main.jsx)
<AuthProvider>
  <App />
</AuthProvider>

// 2. PROVIDER initializes state and checks for existing session
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)    // null = not logged in
  const [loading, setLoading] = useState(true) // true = still checking

  useEffect(() => {
    getMe()                                  // Calls GET /api/users/me
      .then(res => setUser(res.data.user))   // Session exists → set user
      .catch(() => setUser(null))            // No session → stay null
      .finally(() => setLoading(false))      // Done checking
  }, [])

  return (
    <AuthContext.Provider value={{ user, setUser, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

// 3. ANY component anywhere in the tree can access user
function Navbar() {
  const { user, logout } = useAuth()  // Custom hook
  return user ? <button onClick={logout}>Logout</button> : <Link to="/login">Login</Link>
}
```

---

# 13. REACT ROUTER — Client-Side Routing

## What is Client-Side Routing?

In traditional websites (like PHP or Django), clicking a link sends a full HTTP request to the server, which returns a completely new HTML page. The entire page reloads (white flash).

In a React SPA (Single Page Application), the browser loads the entire React app ONCE. When you click a link, React Router:
1. Intercepts the click (prevents full page reload)
2. Updates the browser URL using the History API
3. Renders the matching component

This creates the feeling of a fast, native app — no page reloads, instant transitions.

```javascript
<Routes>
  <Route path="/" element={<Home />} />              // Home page
  <Route path="/listings/:id" element={<ListingShow />} />  // Dynamic route
  <Route path="/profile" element={<Profile />} />     // Protected page
</Routes>
```

The `:id` in `/listings/:id` is a URL parameter. When the URL is `/listings/abc123`, the `ListingShow` component can access `abc123` via `useParams()`:

```javascript
const { id } = useParams()  // id === "abc123"
```

---

# 14. PAGINATION — Server-Side Implementation

## Why Server-Side Pagination (Not Client-Side)?

### Client-Side Pagination (BAD for large datasets)

```javascript
// Fetch ALL 70 listings at once
const allListings = await Listings.find({});
// Then slice in JavaScript
const page1 = allListings.slice(0, 12);
```

**Problem:** If you have 10,000 listings, you are fetching 10,000 documents from MongoDB, sending them all over the network to the browser, and storing them all in memory. This is extremely slow and wasteful.

### Server-Side Pagination (GOOD — what we use)

```javascript
const page = parseInt(req.query.page) || 1;
const limit = 12;
const skip = (page - 1) * limit;  // Page 1: skip 0, Page 2: skip 12, Page 3: skip 24

const listings = await Listings.find({}).skip(skip).limit(limit);
const total = await Listings.countDocuments({});
const totalPages = Math.ceil(total / limit);
```

**Advantage:** MongoDB only loads 12 documents into memory, sends 12 documents over the network, and the browser only renders 12 cards. This works identically whether you have 70 listings or 7 million.

## How `.skip()` and `.limit()` Work in MongoDB

```
Database: [doc1, doc2, doc3, doc4, doc5, doc6, doc7, doc8, ...]

Page 1: .skip(0).limit(3)  → [doc1, doc2, doc3]
Page 2: .skip(3).limit(3)  → [doc4, doc5, doc6]
Page 3: .skip(6).limit(3)  → [doc7, doc8]
```

---

# 15. WATCHLIST — Atomic Database Operations

## Why `$addToSet` and `$pull` (Not Array.push and Array.filter)?

### The Naive Approach (Vulnerable to Race Conditions)

```javascript
// BAD: Read-Modify-Write pattern
const user = await User.findById(userId);
user.watchlist.push(listingId);     // Modify in JavaScript memory
await user.save();                  // Write back to database
```

**The Race Condition Bug:**
If a user rapidly clicks the heart button twice within 50ms:
```
Click 1: Reads watchlist = [A, B]
Click 2: Reads watchlist = [A, B]    (Click 1's save hasn't completed yet)
Click 1: Saves watchlist = [A, B, C]
Click 2: Saves watchlist = [A, B, C]  (Overwrites Click 1's result — C appears once)
```

But what if they click to add C and then quickly click to add D?
```
Click 1: Reads watchlist = [A, B]
Click 2: Reads watchlist = [A, B]
Click 1: Saves watchlist = [A, B, C]
Click 2: Saves watchlist = [A, B, D]  ← C IS LOST! Click 2 overwrote Click 1
```

### The Atomic Approach (What We Use — Bug-Free)

```javascript
// GOOD: Atomic operation — executed entirely within MongoDB
const updateQuery = isWatchlisted
  ? { $pull: { watchlist: listingId } }      // Remove atomically
  : { $addToSet: { watchlist: listingId } };  // Add atomically (prevents duplicates)

await User.findByIdAndUpdate(userId, updateQuery, { new: true });
```

**Why this is safe:** `$addToSet` and `$pull` are atomic operations — they execute entirely within the MongoDB engine in a single operation. There is no gap between "read" and "write" where another operation can interfere.

**Why `$addToSet` instead of `$push`?**

- `$push` blindly adds the value, even if it already exists (creates duplicates)
- `$addToSet` only adds the value IF it is not already present (guarantees uniqueness)

---

# 16. BOOKING SYSTEM — Data Modeling

## The Booking Schema

```javascript
const bookingSchema = new Schema({
  listing: { type: Schema.Types.ObjectId, ref: "Listings", required: true },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  checkIn: { type: Date, required: true },
  checkOut: { type: Date, required: true },
  totalPrice: { type: Number, required: true },
  status: { type: String, enum: ["pending", "confirmed", "cancelled"], default: "confirmed" },
  createdAt: { type: Date, default: Date.now }
});
```

### Why `enum` for Status?

The `enum` constraint restricts the `status` field to ONLY the values `["pending", "confirmed", "cancelled"]`. If someone tries to set `status: "hacked"`, Mongoose will throw a validation error. This is called a **finite state machine pattern** — the booking can only exist in one of three defined states.

### Price Calculation on the Frontend

```javascript
const totalDays = Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24));
const basePrice = listing.price * totalDays;
const gst = Math.round(basePrice * 0.18);  // 18% GST
const finalPrice = basePrice + gst;
```

**Why calculate on the frontend AND store in the database?**

We calculate on the frontend for instant UI feedback (user sees the price update as they select dates). But we store the `totalPrice` in the database as a historical record. If the listing's price changes later, the booking record still reflects what the user actually paid.

---

# 17. CORS — Cross-Origin Resource Sharing

## What is CORS and Why Does it Exist?

CORS is a browser security mechanism. By default, browsers block requests from one domain to a different domain. This prevents malicious websites from making API calls to your bank's website using your cookies.

```
Frontend: https://wanderlust.vercel.app  (Origin A)
Backend:  https://wanderlust.onrender.com  (Origin B)

These are DIFFERENT origins → browser blocks the request by default
```

## How We Solve It

```javascript
// Backend: server.js
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,  // Allow cookies to be sent cross-origin
}));
```

This tells the browser: "Requests from `wanderlust.vercel.app` are trusted. Allow them, including cookies."

**What `credentials: true` does:**

Without it, the browser strips all cookies from cross-origin requests. Since our authentication depends on the session cookie being sent with every request, `credentials: true` is absolutely essential.

---

# 18. DEPLOYMENT ARCHITECTURE — Vercel + Render

## Why Separate Frontend and Backend Deployments?

### Monolithic Deployment (Everything on one server)

```
One Server → Serves React build files AND handles API requests
```

**Problem:** Frontend and backend have completely different resource needs. Frontend needs a fast CDN. Backend needs CPU and RAM for database queries.

### Decoupled Deployment (What we use)

```
Vercel (CDN) → Serves static React files (HTML, CSS, JS)
                 Globally distributed, blazing fast
                 
Render (Web Service) → Runs Express.js server
                        Handles API requests
                        Connects to MongoDB, Cloudinary, etc.
```

**Advantages:**
1. **Faster frontend:** Vercel serves files from 70+ global edge locations (CDN). A user in India gets files from an Indian server, not a US server.
2. **Independent scaling:** If your API is slow, you can upgrade the Render server without touching Vercel.
3. **Independent deployments:** You can update the frontend without redeploying the backend, and vice versa.

## The Vite Proxy (Development Only)

```javascript
// vite.config.js
server: {
  proxy: {
    '/api': { target: 'http://localhost:8080', changeOrigin: true }
  }
}
```

In development, both frontend and backend run on localhost but on different ports (5173 and 8080). The Vite proxy intercepts any request starting with `/api` and forwards it to port 8080. This:
1. Avoids CORS issues in development (same origin)
2. Lets the frontend code use relative URLs like `/api/listings` in both dev and production

In production, we set `VITE_API_URL` to the full Render URL, so Axios sends requests directly to the backend.

---

# 19. ERROR HANDLING PATTERNS

## The `wrapAsync` Utility

```javascript
// utils/WrapAsync.js
module.exports = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};
```

**What problem does this solve?**

Without `wrapAsync`, every async route handler needs a try-catch:

```javascript
// WITHOUT wrapAsync (repetitive and error-prone)
router.get("/:id", async (req, res, next) => {
  try {
    const listing = await Listings.findById(req.params.id);
    res.json({ listing });
  } catch (err) {
    next(err);  // Forward to error handler
  }
});

// WITH wrapAsync (clean and DRY)
router.get("/:id", wrapAsync(async (req, res) => {
  const listing = await Listings.findById(req.params.id);
  res.json({ listing });
}));
```

`wrapAsync` wraps the function in a `.catch(next)`, so any rejected promise automatically triggers the global error handler. This is the DRY (Don't Repeat Yourself) principle in action.

## Joi Validation

```javascript
module.exports.validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if (error) {
    const msgError = error.details.map(el => el.message).join(",");
    throw new ExpressError(400, msgError);
  }
  next();
};
```

**Why validate on the server even though the frontend has form validation?**

Frontend validation can be bypassed. Anyone can open the browser console, Postman, or cURL and send a malformed request directly to your API. Server-side validation is the last line of defense and should NEVER be skipped.

---

# 20. VITE VS CREATE REACT APP

| Feature | Vite (What We Use) | Create React App (CRA) |
|---------|-------|------------------------|
| Dev Server Start Time | ~300ms (instant) | 10-30 seconds |
| Hot Module Replacement | Instant | 2-5 seconds |
| Build Tool | esbuild + Rollup | Webpack |
| Bundle Size | Smaller (tree-shaking) | Larger |
| Configuration | Minimal (vite.config.js) | Hidden (ejectable) |
| Active Development | YES | NO (deprecated by React team) |

**Why Vite?**

CRA uses Webpack, which bundles the entire application on every change. Vite uses native ES modules during development — the browser loads only the files that changed. This makes hot reloading virtually instant, even on large projects. The React team officially recommends Vite over CRA for new projects.

---

# 21. ENVIRONMENT VARIABLES & SECURITY

## Why `.env` Files?

Sensitive values like API keys, database passwords, and secrets must NEVER be hardcoded in source code:

```javascript
// NEVER DO THIS — anyone who sees your code gets your database password
mongoose.connect("mongodb+srv://admin:MySecretPassword@cluster.mongodb.net");

// ALWAYS DO THIS — value comes from environment, not code
mongoose.connect(process.env.ATLASDB_URL);
```

## Frontend vs Backend Environment Variables

| Aspect | Backend (.env) | Frontend (.env) |
|--------|---------------|-----------------|
| Accessible to | Server only | Anyone viewing page source |
| Security level | Fully private | Publicly visible |
| Naming convention | Any name | Must start with `VITE_` |
| Contains secrets? | YES (API keys, DB passwords) | NEVER (only public tokens like Mapbox) |

**Critical Rule:** NEVER put secret API keys in frontend environment variables. The Mapbox token in `VITE_MAP_TOKEN` is a public token designed to be visible. The Gemini API key is kept on the backend because it is private.

---

# 22. RESTFUL API DESIGN PRINCIPLES

## What Makes an API "RESTful"?

REST (Representational State Transfer) is a set of conventions for designing APIs:

| HTTP Method | Purpose | Example | Your Route |
|-------------|---------|---------|------------|
| GET | Read data | Get all listings | `GET /api/listings` |
| POST | Create data | Create a listing | `POST /api/listings` |
| PUT | Update data | Update a listing | `PUT /api/listings/:id` |
| DELETE | Remove data | Delete a listing | `DELETE /api/listings/:id` |

**Key Principles Your API Follows:**

1. **Nouns, not verbs** in URLs: `/api/listings` (not `/api/getListings`)
2. **HTTP methods define the action**: The URL stays the same, only the method changes
3. **Stateless**: Each request contains all the information needed (via cookies)
4. **Consistent response format**: Always returns JSON with predictable structure

---

# 23. PRACTICE QUESTIONS

Answer these out loud to yourself before your interview. If you can explain each answer clearly in 2-3 sentences, you are fully prepared.

## Architecture & Design

1. Explain the complete flow of what happens when a user clicks "Reserve" on a listing.
2. Why did you choose MongoDB over PostgreSQL for this project?
3. What would you change if this application needed to support 1 million users?
4. Why did you split the frontend and backend into separate deployments?

## Authentication & Security

5. How does session-based authentication work in your application? Walk through the login flow step by step.
6. What is the difference between authentication and authorization? Give examples from your project.
7. Why did you choose Sessions over JWT? When would you switch to JWT?
8. What does `httpOnly: true` on a cookie do, and why is it important?
9. What is CSRF? How does the `sameSite` cookie attribute protect against it?
10. Why do you NEVER store the plain text password in the database?

## Database

11. Explain the difference between embedding and referencing in MongoDB. When do you use each?
12. Why are reviews stored as references (ObjectIds) while the watchlist is stored inside the User document?
13. What does `.populate()` do under the hood? How many database queries does it execute?
14. What is the 16MB document size limit in MongoDB, and how does it affect your schema design?
15. Why do you use `$addToSet` instead of `$push` for the watchlist?

## Backend (Node.js / Express)

16. What is Express middleware? Explain using your `isLoggedIn` middleware as an example.
17. What happens if you forget to call `next()` in a middleware function?
18. What is `wrapAsync` and what problem does it solve?
19. Why do you validate data on the server even though the frontend already validates it?
20. How does the image upload pipeline work from the browser to Cloudinary?

## Frontend (React)

21. Why did you use Axios instead of the built-in `fetch` API?
22. What is the Context API and why did you use it instead of Redux?
23. Explain the difference between `useState` and `useEffect`.
24. What does the dependency array in `useEffect` do? What happens if you pass an empty array `[]`?
25. How does server-side pagination work in your application?

## Deployment & DevOps

26. What is CORS and why does it exist? How did you configure it for production?
27. Why is the Vite proxy only needed in development, not production?
28. What is the difference between `VITE_MAP_TOKEN` (frontend env var) and `GEMINI_API_KEY` (backend env var)?
29. Why can you NOT store the Gemini API key in a frontend environment variable?
30. What happens if your Render server restarts — do all users get logged out? Why or why not?

---

> **Final Advice:** You do not need to have built every line of code yourself to own this project in an interview. What matters is that you deeply UNDERSTAND the engineering decisions. If an interviewer asks "Why did you use Sessions instead of JWT?" and you give a clear, confident answer about XSS protection and instant revocation — they will be genuinely impressed. That is what separates a great candidate from an average one.

---

*Document generated for interview preparation. Study the concepts, trace the code flows, and practice answering the questions out loud.*
