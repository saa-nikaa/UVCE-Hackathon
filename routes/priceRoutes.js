// routes/priceRoutes.js
const express = require('express');
const router = express.Router();
const CropPrice = require('../models/CropPrice');

// Get latest price for all crops
router.get('/latest', async (req, res) => {
  try {
    const latestPrices = await CropPrice.aggregate([
      { $sort: { date: -1 } },
      {
        $group: {
          _id: "$crop",
          crop: { $first: "$crop" },
          market: { $first: "$market" },
          pricePerKg: { $first: "$pricePerKg" },
          date: { $first: "$date" }
        }
      }
    ]);
    res.json(latestPrices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get historical prices for a crop
router.get('/history/:crop', async (req, res) => {
  try {
    const prices = await CropPrice.find({ crop: req.params.crop }).sort({ date: 1 });
    res.json(prices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
