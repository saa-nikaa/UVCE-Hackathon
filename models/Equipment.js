// models/Equipment.js
const mongoose = require("mongoose");

const CertificationSchema = new mongoose.Schema(
  {
    status: { type: Boolean, default: false },
    standard: { type: String },          // e.g., "IS 12345:2020"
    certBody: { type: String },          // e.g., "BIS", "ICAR"
    certId: { type: String },            // certificate number / UID
    issuedAt: { type: Date },
    expiresAt: { type: Date },
    notes: { type: String },
  },
  { _id: false }
);

const EquipmentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    quantity: { type: Number, default: 1 },
    price: { type: Number, required: true },     // per hour
    location: { type: String, required: true },
    icon: { type: String, default: "default.png" },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    certified: { type: CertificationSchema, default: () => ({}) },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Equipment", EquipmentSchema);
