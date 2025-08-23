// routes/paymentWebhook.js
import express from "express";
import crypto from "crypto";
import Transaction from "../models/Transaction.js";

const router = express.Router();

router.post("/webhook", express.json({ type: "application/json" }), (req, res) => {
  const signature = req.headers["x-razorpay-signature"];
  const shasum = crypto.createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET);
  shasum.update(JSON.stringify(req.body));
  const digest = shasum.digest("hex");

  if (digest === signature) {
    console.log("✅ Webhook verified:", req.body);

    // Example: update transaction in DB
    const { payload } = req.body;
    if (payload?.payment?.entity) {
      const payment = payload.payment.entity;
      Transaction.findOneAndUpdate(
        { razorpay_order_id: payment.order_id },
        { status: payment.status },
        { new: true }
      ).then(updated => console.log("Transaction updated:", updated));
    }
  } else {
    console.log("❌ Webhook signature mismatch");
  }

  res.json({ status: "ok" });
});

export default router;
