
const express = require("express");
const router = express.Router();
const passport = require("passport");
const wrapAsync = require("../utils/WrapAsync");
const { watchListController } = require("../controllers/watchListController");
const { isLoggedIn } = require("../middleware/auth");

router.post("/:id",isLoggedIn ,watchListController) 


module.exports = router;