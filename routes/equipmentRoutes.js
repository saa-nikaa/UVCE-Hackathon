// routes/equipmentRoutes.js
const express = require("express");
const router = express.Router();

const {
  getEquipment,
  addEquipment,
  certifyEquipment,
} = require("../controllers/equipmentController");

const { protect, isAdmin } = require("../middleware/authMiddleware");

// Routes
router.get("/", protect, getEquipment);
router.post("/", protect, addEquipment);
router.put("/certify/:id", protect, isAdmin, certifyEquipment);

module.exports = router;
