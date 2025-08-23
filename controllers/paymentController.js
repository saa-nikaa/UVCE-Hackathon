const Razorpay = require("razorpay");
const rentals = require("../models/Transaction"); // your rental model
const crypto = require("crypto");

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Create Order
exports.createOrder = async (req, res) => {
    const { rentalId, amount } = req.body; // amount in rupees
    try {
        const options = {
            amount: amount * 100, // amount in paise
            currency: "INR",
            receipt: `receipt_${rentalId}`,
        };
        const order = await razorpay.orders.create(options);
        res.json(order);
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
};

// Verify Payment
exports.verifyPayment = async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, rentalId } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
                                    .update(body.toString())
                                    .digest("hex");

    if (expectedSignature === razorpay_signature) {
        // Update rental status to paid
        await rentals.findByIdAndUpdate(rentalId, { paid: true, paymentId: razorpay_payment_id });
        res.json({ success: true, message: "Payment verified successfully" });
    } else {
        res.status(400).json({ success: false, message: "Invalid signature" });
    }
};
