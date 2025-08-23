const mongoose = require('mongoose');

const equipmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true }, // per hour
  location: { type: String, required: true },
  icon: { type: String, default: 'default.png' },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  certified: { type: Boolean, default: false },
  certifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Equipment', equipmentSchema);
