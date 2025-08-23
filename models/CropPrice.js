// models/CropPrice.js
const mongoose = require('mongoose');

const CropPriceSchema = new mongoose.Schema({
  crop: { type: String, required: true },
  market: { type: String, required: true },
  pricePerKg: { type: Number, required: true },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CropPrice', CropPriceSchema);
