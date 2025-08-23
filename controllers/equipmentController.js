const Equipment = require('../models/Equipment');

// List all equipment
exports.getEquipment = async (req, res) => {
  try {
    const equipment = await Equipment.find().populate('owner', 'name email');
    res.json(equipment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add equipment
exports.addEquipment = async (req, res) => {
  try {
    const { name, quantity, pricePerDay, pricePerHour, location, icon } = req.body;

    const newEquip = new Equipment({
      name,
      quantity,
      pricePerDay,
      pricePerHour,
      location,
      icon,
      owner: req.user._id
    });

    await newEquip.save();
    res.status(201).json(newEquip);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Certify equipment (admin/certifier only)
exports.certifyEquipment = async (req, res) => {
  try {
    const equip = await Equipment.findById(req.params.id);
    if (!equip) return res.status(404).json({ message: 'Equipment not found' });

    equip.certified = true;
    await equip.save();

    res.json({ message: `${equip.name} certified successfully`, equipment: equip });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
