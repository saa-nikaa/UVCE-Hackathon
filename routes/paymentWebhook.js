// backend/routes/paymentWebhook.js
const express = require("express");
const crypto = require("crypto");

const router = express.Router();

// Use raw body for Razorpay signature verification
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    try {
      const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
      const signature = req.headers["x-razorpay-signature"];

      if (!webhookSecret) {
        console.error("❌ RAZORPAY_WEBHOOK_SECRET not set");
        return res.status(500).send("Secret missing");
      }

      const shasum = crypto.createHmac("sha256", webhookSecret);
      // IMPORTANT: use raw body here
      shasum.update(req.body);
      const digest = shasum.digest("hex");

      if (digest === signature) {
        // Verified
        const event = JSON.parse(req.body.toString("utf8"));
        console.log("✅ Webhook verified:", event.event);

        // Example: if payment authorized/captured, update DB
        // const Transaction = require("../models/Transaction");
        // await Transaction.findOneAndUpdate(
        //   { razorpay_order_id: event.payload.payment.entity.order_id },
        //   {
        //     status: event.payload.payment.entity.status,
        //     razorpay_payment_id: event.payload.payment.entity.id,
        //   },
        //   { upsert: true }
        // );

        return res.status(200).json({ status: "ok" });
      } else {
        console.warn("❌ Webhook signature mismatch");
        return res.status(400).json({ status: "invalid-signature" });
      }
    } catch (err) {
      console.error("❌ Webhook error:", err);
      return res.status(500).json({ status: "error" });
    }
  }
);

module.exports = router;
