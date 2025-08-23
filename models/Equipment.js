const mongoose = require('mongoose');

const equipmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  pricePerDay: { type: Number, required: true },
  pricePerHour: { type: Number, default: 0 },
  location: { type: String, required: true },
  icon: { type: String, default: 'default.png' },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  certified: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Equipment', equipmentSchema);
