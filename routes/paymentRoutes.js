import express from "express";
import Razorpay from "razorpay";
import crypto from "crypto";

const router = express.Router();

// 🔑 Load Razorpay keys from .env
const { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } = process.env;

if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
  console.error("❌ Razorpay keys missing in .env");
}

// 🔧 Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: RAZORPAY_KEY_ID,
  key_secret: RAZORPAY_KEY_SECRET,
});

// 📌 1. Create Order
router.post("/order", async (req, res) => {
  try {
    const { amount, currency = "INR" } = req.body;

    const options = {
      amount: amount, // 💰 amount in paise
      currency,
      receipt: "order_rcptid_" + Date.now(),
    };

    const order = await razorpay.orders.create(options);
    res.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error("❌ Order creation error:", err);
    res.status(500).json({ success: false, message: "Failed to create order" });
  }
});

// 📌 2. Verify Payment Signature
router.post("/verify", (req, res) => {
  try {
    const { orderId, paymentId, signature } = req.body;

    const hmac = crypto.createHmac("sha256", RAZORPAY_KEY_SECRET);
    hmac.update(orderId + "|" + paymentId);
    const generatedSignature = hmac.digest("hex");

    if (generatedSignature === signature) {
      console.log("✅ Payment verified:", paymentId);
      res.json({ success: true, paymentId });
    } else {
      console.log("❌ Invalid signature");
      res.json({ success: false });
    }
  } catch (err) {
    console.error("❌ Verification error:", err);
    res.status(500).json({ success: false });
  }
});

export default router;
