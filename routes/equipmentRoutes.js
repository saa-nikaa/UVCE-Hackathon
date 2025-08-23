const express = require('express');
const router = express.Router();
const { getEquipment, addEquipment, certifyEquipment } = require('../controllers/equipmentController');
const { protect } = require('/middleware/authMiddleware');

// Get all equipment
router.get('/', protect, getEquipment);

// Add new equipment
router.post('/', protect, addEquipment);

// Certify equipment
router.put('/certify/:id', protect, certifyEquipment);

module.exports = router;
