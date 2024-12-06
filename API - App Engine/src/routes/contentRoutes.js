const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const contentController = require("../controllers/contentController");
const verifyToken = require("../middlewares/authMiddleware.js");

router.use(bodyParser.json());

// API Endpoint for Access the Exercise Page
router.get("/content", verifyToken, contentController.getContentList);

// API Endpoint for Get The List of Exercise Content
router.get("/content/:id", verifyToken, contentController.getContentDetails);

module.exports = router;
