const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// API Endpoint for Get Specific User Data
router.get("/user/:userId", userController.getUser);

// API Endpoint for Update Specific User Data
router.put("/update/:userId", userController.updateUser);

// API Endpoint for Delete Specific User Data
router.delete("/delete/:userId", userController.deleteUser);

module.exports = router;
