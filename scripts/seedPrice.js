// scripts/seedPrice.js
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const CropPrice = require("../backend/models/CropPrice");

const uri = process.env.MONGO_URI || "mongodb://localhost:27017/agriconnect";

(async () => {
  await mongoose.connect(uri);
  console.log("Connected");

  const crops = ["Wheat", "Rice", "Maize", "Tur", "Onion"];
  const markets = [
    { market: "Bengaluru", state: "Karnataka" },
    { market: "Davangere", state: "Karnataka" },
    { market: "Pune", state: "Maharashtra" },
    { market: "Nagpur", state: "Maharashtra" },
    { market: "Ahmedabad", state: "Gujarat" }
  ];

  const days = 60;
  const rows = [];
  const now = new Date();

  crops.forEach(crop => {
    for (let d = days; d >= 0; d--) {
      const observedAt = new Date(now.getTime() - d * 24 * 3600 * 1000);
      markets.forEach(m => {
        const base = 1500 + Math.floor(Math.random() * 1200);
        const noise = Math.floor((Math.random() - 0.5) * 200);
        const modal = base + noise;
        rows.push({
          crop,
          market: m.market,
          state: m.state,
          min: modal - 150,
          max: modal + 150,
          modal,
          observedAt,
          unit: "₹/quintal",
          source: "seed"
        });
      });
    }
  });

  await CropPrice.deleteMany({});
  await CropPrice.insertMany(rows);
  console.log(`Seeded ${rows.length} rows`);
  await mongoose.disconnect();
})();
