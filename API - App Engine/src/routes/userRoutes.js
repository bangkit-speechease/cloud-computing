const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const verifyToken = require("../middlewares/authMiddleware.js");

// API Endpoint for Get Specific User Data
router.get("/user/:userId", verifyToken, userController.getUser);

// API Endpoint for Update Specific User Data
router.put("/update/:userId", verifyToken, userController.updateUser);

// API Endpoint for Delete Specific User Data
router.delete("/delete/:userId", verifyToken, userController.deleteUser);

module.exports = router;
