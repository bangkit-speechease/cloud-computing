<<<<<<< HEAD
const express = require("express");
const router = express.Router();
const authController = require("./userControllers");

// API Endpoint for Get Specific User Data
router.get("/user/:userId", authController.getUser);

// API Endpoint for Update Specific User Data
router.put("/update/:userId", authController.updateUser);

// // API Endpoint for Delete Specific User Data
// router.delete('/delete/:userId', authController.deleteUser);
=======
const express = require('express');
const router = express.Router();
const userController = require('./userControllers');

// API Endpoint for Get Specific User Data
router.get('/user/:userId', userController.getUser);

// API Endpoint for Update Specific User Data
router.put('/update/:userId', userController.updateUser);

// API Endpoint for Delete Specific User Data
router.delete('/delete/:userId', userController.deleteUser);
>>>>>>> c26fe480dc87018bec975fd6980a74b22d4f290a

module.exports = router;
