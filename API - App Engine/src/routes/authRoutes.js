const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const authController = require("../controllers/authController");

router.use(bodyParser.json());

// API Endpoint for Register a User
router.post("/register", authController.registerApp);

// API Endpoint for Login to the App
router.post("/login", authController.loginApp);

module.exports = router;
