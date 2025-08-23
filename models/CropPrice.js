// backend/models/CropPrice.js
const mongoose = require("mongoose");

const CropPriceSchema = new mongoose.Schema(
  {
    crop: { type: String, index: true, required: true },          // e.g., "Wheat"
    market: { type: String, required: true },                      // e.g., "Bengaluru"
    state: { type: String, required: true },                       // e.g., "Karnataka"
    unit: { type: String, default: "₹/quintal" },                  // display unit
    min: { type: Number, required: true },
    max: { type: Number, required: true },
    modal: { type: Number, required: true },                       // common rate used
    source: { type: String, default: "manual" },                   // e.g., "agmarknet"
    observedAt: { type: Date, required: true, index: true },       // timestamp of quote
  },
  { timestamps: true }
);

// helpful compound index for time series queries
CropPriceSchema.index({ crop: 1, observedAt: -1 });

module.exports = mongoose.model("CropPrice", CropPriceSchema);
