// backend/routes/priceRoutes.js
const express = require("express");
const router = express.Router();
const { getLatestPrices, getPriceHistory } = require("../controllers/priceController");

router.get("/latest", getLatestPrices);
router.get("/history/:crop", getPriceHistory);

module.exports = router;
