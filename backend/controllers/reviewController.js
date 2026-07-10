const Review = require("../models/review");
const Listing = require("../models/listing");

module.exports.createReview = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) return res.status(404).json({ error: "Listing not found" });

  const review = new Review({
    rating: req.body.rating,
    comment: req.body.comment,
    author: req.user._id,
  });

  listing.reviews.push(review);
  await review.save();
  await listing.save();

  const populated = await review.populate("author", "username");
  res.status(201).json({ message: "Review added", review: populated });
};

module.exports.destroyReview = async (req, res) => {
  const { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  res.json({ message: "Review deleted" });
};
