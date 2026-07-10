const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middleware/auth");
const { generateDescription } = require("../controllers/generateController");

router.post("/", isLoggedIn, generateDescription);

module.exports = router;
