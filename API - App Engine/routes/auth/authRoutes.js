const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const authController = require("./authControllers");

router.use(bodyParser.json());

// API Endpoint for Register a User
router.post("/register", authController.registerApp);

// API Endpoint for Login to the App
router.post("/login", authController.loginApp);

// API Endpoint for Logout from the App
router.post("/logout", authController.logoutApp);

module.exports = router;
