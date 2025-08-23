// controllers/equipmentController.js
const Equipment = require("../models/Equipment");

// Get all equipment
const getEquipment = async (req, res) => {
  try {
    const equipment = await Equipment.find();
    res.json(equipment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add equipment
const addEquipment = async (req, res) => {
  try {
    const newEquipment = new Equipment(req.body);
    await newEquipment.save();
    res.status(201).json(newEquipment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Certify equipment
const certifyEquipment = async (req, res) => {
  try {
    const equipment = await Equipment.findById(req.params.id);
    if (!equipment) return res.status(404).json({ message: "Equipment not found" });

    equipment.certified = true;
    await equipment.save();

    res.json({ message: "Equipment certified", equipment });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getEquipment, addEquipment, certifyEquipment };
