const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  equipment: { type: mongoose.Schema.Types.ObjectId, ref: "Equipment", required: true },
  renter: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  hours: { type: Number, required: true },
  amount: { type: Number, required: true }, // in INR
  orderId: { type: String, required: true },
  paymentId: { type: String },
  status: { type: String, enum: ["pending", "paid", "failed"], default: "pending" }
}, { timestamps: true });

module.exports = mongoose.model("Transaction", transactionSchema);
