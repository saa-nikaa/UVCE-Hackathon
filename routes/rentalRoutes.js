const express = require('express');
const router = express.Router();
const { rentEquipment, getMyRentals } = require('../controllers/rentalController');
const { authMiddleware } = require('middleware/authMiddleware');

router.post('/rent', authMiddleware, rentEquipment);      // Rent equipment
router.get('/my-rentals', authMiddleware, getMyRentals); // Get rentals of logged-in user

module.exports = router;
