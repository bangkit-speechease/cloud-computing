const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const feedbackController = require("../controllers/feedbackController");

// To handle file uploads
const multer = require("multer");

// Configures Multer to store uploaded files in memory as Buffer objects
const storage = multer.memoryStorage();

// Initializes Multer with the defined memory storage configuration for handling file uploads
const upload = multer({ storage });

const verifyToken = require("../middlewares/authMiddleware.js");

// Middleware to parse incoming JSON data into a Javascript object
router.use(bodyParser.json());

// API Endpoint for Get The Feedback for ML Model
router.post(
  "/feedback",
  verifyToken,
  upload.single("file"),
  feedbackController.getFeedback
);

module.exports = router;
