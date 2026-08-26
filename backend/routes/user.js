const express = require("express");
const router = express.Router();
const passport = require("passport");
const wrapAsync = require("../utils/WrapAsync");
const userController = require("../controllers/userController");

router.post("/signup", wrapAsync(userController.signUp));
router.post("/login", passport.authenticate("local"), userController.login);
router.post("/logout", userController.logout);
router.get("/me", userController.getCurrentUser);
const { isLoggedIn } = require("../middleware/auth");
router.post("/watchlist/:listingId", isLoggedIn, wrapAsync(userController.toggleWatchlist));
router.get("/watchlist", isLoggedIn, wrapAsync(userController.getWatchlist));

module.exports = router;
