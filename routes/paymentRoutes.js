const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const router = express.Router();

// init razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// @desc Create order
router.post("/order", async (req, res) => {
  try {
    let { amount } = req.body;

    // Convert ₹ to paise if amount is in rupees
    if (amount < 1000000) {
      amount = amount * 100; // assume frontend sends rupees
    }

    const options = {
      amount: amount, // paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    res.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error("Order error:", err);
    res.status(500).json({ success: false, message: "Order creation failed" });
  }
});

// @desc Verify payment
router.post("/verify", (req, res) => {
  try {
    const { orderId, paymentId, signature } = req.body;

    const sign = orderId + "|" + paymentId;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (expectedSign === signature) {
      return res.json({ success: true });
    } else {
      return res.json({ success: false });
    }
  } catch (err) {
    console.error("Verify error:", err);
    res.status(500).json({ success: false, message: "Verification failed" });
  }
});

module.exports = router;
