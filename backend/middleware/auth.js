const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const { listingSchema, reviewSchema } = require("../config/schema.js");
const ExpressError = require("../utils/ExpressError.js");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: "You must be logged in" });
  }
  next();
};

module.exports.isOwner = async (req, res, next) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) return res.status(404).json({ error: "Listing not found" });
  if (!req.user || !listing.owner._id.equals(req.user._id)) {
    return res.status(403).json({ error: "You don't have permission to do this" });
  }
  next();
};

module.exports.isAuthor = async (req, res, next) => {
  const { reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review) return res.status(404).json({ error: "Review not found" });
  if (!req.user || !review.author.equals(req.user._id)) {
    return res.status(403).json({ error: "You don't have permission to do this" });
  }
  next();
};

module.exports.validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if (error) {
    const msgError = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, msgError);
  }
  next();
};

module.exports.validateReviews = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msgError = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, msgError);
  }
  next();
};
