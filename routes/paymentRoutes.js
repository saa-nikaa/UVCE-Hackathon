// backend/routes/paymentRoutes.js
const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");

const router = express.Router();

const { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } = process.env;

if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
  console.error("❌ Razorpay keys missing in .env");
}

const razorpay = new Razorpay({
  key_id: RAZORPAY_KEY_ID,
  key_secret: RAZORPAY_KEY_SECRET,
});

// 1) Create Order
router.post("/order", async (req, res) => {
  try {
    const { amount, currency = "INR", receipt } = req.body;
    if (!amount) {
      return res.status(400).json({ success: false, message: "Amount is required" });
    }
    const options = {
      amount: Number(amount), // ✅ amount already in paise from frontend
      currency,
      receipt: receipt || "order_rcptid_" + Date.now(),
    };
    const order = await razorpay.orders.create(options);
    return res.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error("❌ Order creation error:", err);
    return res.status(500).json({ success: false, message: "Failed to create order" });
  }
});

// 2) Verify Payment Signature
router.post("/verify", async (req, res) => {
  try {
    const { orderId, paymentId, signature } = req.body;
    if (!orderId || !paymentId || !signature) {
      return res.status(400).json({ success: false, message: "Missing fields" });
    }

    const hmac = crypto.createHmac("sha256", RAZORPAY_KEY_SECRET);
    hmac.update(orderId + "|" + paymentId);
    const generatedSignature = hmac.digest("hex");

    if (generatedSignature === signature) {
      return res.json({ success: true, paymentId });
    } else {
      return res.json({ success: false, message: "Invalid signature" });
    }
  } catch (err) {
    console.error("❌ Verification error:", err);
    return res.status(500).json({ success: false, message: "Verification error" });
  }
});

module.exports = router;
