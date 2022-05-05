const express = require("express");
const authController = require("../controllers/AuthenticationController");

const router = express.Router();

router.get("/login", authController.getGoogleAuthURL);
router.get("/auth", authController.getUserProfile);

module.exports = router;
