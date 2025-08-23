// scripts/seedPrices.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const CropPrice = require('../models/CropPrice');

dotenv.config();
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

const sampleData = [
  { crop: "Wheat", market: "Market A", pricePerKg: 180 },
  { crop: "Rice", market: "Market B", pricePerKg: 120 },
  { crop: "Corn", market: "Market C", pricePerKg: 90 },
  { crop: "Wheat", market: "Market A", pricePerKg: 185, date: new Date('2025-08-20') },
  { crop: "Rice", market: "Market B", pricePerKg: 115, date: new Date('2025-08-20') },
];

CropPrice.insertMany(sampleData)
  .then(() => {
    console.log("Sample prices inserted ✅");
    mongoose.connection.close();
  })
  .catch(err => console.error(err));
