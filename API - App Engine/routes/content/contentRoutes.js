const express = require('express');
const router = express.Router();
const contentController = require('./contentControllers');

// API Endpoint for Access the Exercise Page
router.post('/exercise', contentController.registerApp);

// API Endpoint for Access the Interactive Page
router.post('/interactive', contentController.loginApp);

module.exports = router;
