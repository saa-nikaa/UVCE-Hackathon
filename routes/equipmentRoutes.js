const express = require("express");
const router = express.Router();
const { certifyEquipment } = require("../controllers/equipmentController");
const { authMiddleware } = require("../middleware/authMiddleware");

// Only logged-in users with certifier/admin role
router.patch("/certify/:equipmentId", authMiddleware, certifyEquipment);

module.exports = router;
