const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
<<<<<<< HEAD
const contentController = require("./contentControllers");

router.use(bodyParser.json());

// API Endpoint for Access the Exercise Page
router.get("/content", contentController.getContentList);

// API Endpoint for Get The List of Exercise Content
router.get("/content/:id", contentController.getContentDetails);
=======
const contentController = require('./contentControllers');

router.use(bodyParser.json());

// API Endpoint for Access the Exercise Page
router.get('/content', contentController.getContentList);

// API Endpoint for Get The List of Exercise Content
router.get('/content/:contentId', contentController.getContentDetails)
>>>>>>> c26fe480dc87018bec975fd6980a74b22d4f290a

module.exports = router;
