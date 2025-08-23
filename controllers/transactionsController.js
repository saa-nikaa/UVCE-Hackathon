const Transaction = require('../models/Transaction');
const Equipment = require('../models/Equipment');

exports.rentEquipment = async (req, res) => {
  try {
    const { equipmentId, hours } = req.body;
    const equip = await Equipment.findById(equipmentId);
    if (!equip || equip.quantity < 1) return res.status(400).json({ error: 'Not enough quantity' });

    // Reduce equipment quantity
    equip.quantity -= 1;
    await equip.save();

    // Create transaction
    const transaction = new Transaction({
      equipment: equip._id,
      renter: req.user._id,
      owner: equip.owner,
      hours
    });
    await transaction.save();

    res.json({ message: `Rented ${equip.name} for ${hours} hours`, transaction });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMyRentals = async (req, res) => {
  try {
    const rentals = await Transaction.find({ renter: req.user._id }).populate('equipment owner');
    res.json(rentals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
