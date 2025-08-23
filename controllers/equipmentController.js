// Certify equipment (only for authorized role)
exports.certifyEquipment = async (req, res) => {
  const { equipmentId } = req.params;
  const user = req.user; // comes from authMiddleware

  // Only certifiers/admins can certify
  if (user.role !== "certifier" && user.role !== "admin") {
    return res.status(403).json({ message: "Unauthorized" });
  }

  try {
    const equipment = await Equipment.findById(equipmentId);
    if (!equipment) {
      return res.status(404).json({ message: "Equipment not found" });
    }

    equipment.certified = true;
    await equipment.save();

    res.json({ message: `${equipment.name} is now certified!`, equipment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
