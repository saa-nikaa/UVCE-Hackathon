const express = require('express');
const router = express.Router();
const transactionsController = require('../controllers/transactionsController');
const { authMiddleware } = require('../middleware/authMiddleware');

// Rent equipment
router.post('/rent', authMiddleware, transactionsController.rentEquipment);

// Get my rentals
router.get('/my-rentals', authMiddleware, transactionsController.getMyRentals);

module.exports = router;
