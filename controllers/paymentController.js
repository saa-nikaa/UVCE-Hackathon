// backend/controllers/paymentController.js
const Razorpay = require("razorpay");
const crypto = require("crypto");

const { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } = process.env;

const razorpay = new Razorpay({
  key_id: RAZORPAY_KEY_ID,
  key_secret: RAZORPAY_KEY_SECRET,
});

exports.createOrder = async (req, res) => {
  try {
    const { amount, currency = "INR", receipt } = req.body;
    const order = await razorpay.orders.create({
      amount: Math.round(Number(amount)),
      currency,
      receipt: receipt || "order_rcptid_" + Date.now(),
    });
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
};

exports.verifyPayment = async (req, res) => {
  try {
    const { orderId, paymentId, signature } = req.body;
    const hmac = crypto.createHmac("sha256", RAZORPAY_KEY_SECRET);
    hmac.update(orderId + "|" + paymentId);
    const generatedSignature = hmac.digest("hex");

    if (generatedSignature === signature) {
      return res.json({ success: true, paymentId });
    }
    return res.json({ success: false, message: "Invalid signature" });
  } catch (err) {
    console.error("❌ Verification error:", err);
    return res.status(500).json({ success: false, message: "Verification error" });
  }
};
