const Rental = require('../models/Rental');
const Equipment = require('../models/Equipment');

exports.rentEquipment = async (req, res) => {
  const { equipmentId, quantity, rentalDurationHours } = req.body;
  const userId = req.user.id; // From authMiddleware

  try {
    const equipment = await Equipment.findById(equipmentId);
    if (!equipment) return res.status(404).json({ message: "Equipment not found" });
    if (equipment.quantity < quantity) return res.status(400).json({ message: "Not enough equipment" });

    equipment.quantity -= quantity;
    await equipment.save();

    const rental = await Rental.create({
      equipment: equipment.name,
      quantity,
      pricePerHour: equipment.pricePerHour,
      renter: userId,
      owner: equipment.owner,
      rentalDurationHours
    });

    res.status(201).json({ message: "Equipment rented successfully", rental });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getMyRentals = async (req, res) => {
  try {
    const rentals = await Rental.find({ renter: req.user.id }).populate('owner', 'name email');
    res.json(rentals);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
