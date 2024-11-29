const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const contentController = require("./contentControllers");

router.use(bodyParser.json());

// API Endpoint for Access the Exercise Page
router.get("/content", contentController.getContentList);

// API Endpoint for Get The List of Exercise Content
router.get("/content/:contentId", contentController.getContentDetails);

module.exports = router;
