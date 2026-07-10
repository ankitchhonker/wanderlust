const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/WrapAsync");
const { isLoggedIn, isAuthor, validateReviews } = require("../middleware/auth");
const reviewController = require("../controllers/reviewController");

router.post("/", isLoggedIn, validateReviews, wrapAsync(reviewController.createReview));
router.delete("/:reviewId", isLoggedIn, isAuthor, wrapAsync(reviewController.destroyReview));

module.exports = router;
