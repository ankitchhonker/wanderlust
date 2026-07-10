const express = require("express");
const router = express.Router();
const multer = require("multer");
const { storage } = require("../config/cloudConfig");
const upload = multer({ storage });
const wrapAsync = require("../utils/WrapAsync");
const { isLoggedIn, isOwner } = require("../middleware/auth");
const listingController = require("../controllers/listingController");

router.get("/", wrapAsync(listingController.index));
router.get("/category/:category", wrapAsync(listingController.getByCategory));
router.get("/search", wrapAsync(listingController.search));
router.post("/", isLoggedIn, upload.single("image"), wrapAsync(listingController.createListing));
router.get("/:id", wrapAsync(listingController.showListing));
router.put("/:id", isLoggedIn, isOwner, upload.single("image"), wrapAsync(listingController.updateListing));
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));

module.exports = router;
