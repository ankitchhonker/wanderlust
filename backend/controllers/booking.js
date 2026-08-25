const Booking = require("../models/booking");
const Listing = require("../models/listing");

module.exports.createBooking = async (req, res) => {
  try {
    const { listingId, checkIn, checkOut, totalPrice } = req.body;
    
    // Check if listing exists
    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({ error: "Listing not found" });
    }

    const newBooking = new Booking({
      listing: listingId,
      user: req.user._id,
      checkIn,
      checkOut,
      totalPrice,
      status: "confirmed"
    });

    await newBooking.save();
    res.status(201).json({ message: "Booking confirmed", booking: newBooking });
  } catch (err) {
    console.error("Booking Error:", err);
    res.status(500).json({ error: "Failed to create booking" });
  }
};

module.exports.getUserBookings = async (req, res) => {
  try {
    // Populate the listing info so the frontend can display the property details
    const bookings = await Booking.find({ user: req.user._id })
      .populate("listing")
      .sort({ createdAt: -1 });
    
    res.json({ bookings });
  } catch (err) {
    console.error("Fetch Bookings Error:", err);
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
};
