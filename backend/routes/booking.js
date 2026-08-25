const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middleware/auth");
const { createBooking, getUserBookings } = require("../controllers/booking");

// Create a booking
router.post("/", isLoggedIn, createBooking);

// Get my bookings
router.get("/me", isLoggedIn, getUserBookings);

module.exports = router;
