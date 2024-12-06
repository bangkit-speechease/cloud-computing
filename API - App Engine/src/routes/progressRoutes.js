const express = require("express");
const router = express.Router();
const progressController = require("../controllers/progressController");
const verifyToken = require("../middlewares/authMiddleware.js");

// Route to get progress data
router.get("/progress/:userId", verifyToken, progressController.getProgress);

// Route to add new progress
router.post("/progress", verifyToken, progressController.addProgress);

// Route to update progress
router.put("/progress/:progressId", verifyToken, progressController.updateProgress);

module.exports = router;
