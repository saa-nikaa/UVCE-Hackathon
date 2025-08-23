// backend/controllers/priceController.js
const dayjs = require("dayjs");

// Mock DB for now – replace later with real API (Agmarknet / API Ninjas)
const mockData = {
  wheat: [
    { date: dayjs().subtract(6, "day").toDate(), pricePerKg: 45 },
    { date: dayjs().subtract(5, "day").toDate(), pricePerKg: 46 },
    { date: dayjs().subtract(4, "day").toDate(), pricePerKg: 44 },
    { date: dayjs().subtract(3, "day").toDate(), pricePerKg: 47 },
    { date: dayjs().subtract(2, "day").toDate(), pricePerKg: 48 },
    { date: dayjs().subtract(1, "day").toDate(), pricePerKg: 49 },
    { date: dayjs().toDate(), pricePerKg: 50 },
  ],
  rice: [
    { date: dayjs().subtract(6, "day").toDate(), pricePerKg: 60 },
    { date: dayjs().subtract(5, "day").toDate(), pricePerKg: 62 },
    { date: dayjs().subtract(4, "day").toDate(), pricePerKg: 61 },
    { date: dayjs().subtract(3, "day").toDate(), pricePerKg: 63 },
    { date: dayjs().subtract(2, "day").toDate(), pricePerKg: 64 },
    { date: dayjs().subtract(1, "day").toDate(), pricePerKg: 65 },
    { date: dayjs().toDate(), pricePerKg: 66 },
  ]
};

// Latest prices
exports.getLatestPrices = (req, res) => {
  const latest = Object.keys(mockData).map(crop => {
    const history = mockData[crop];
    return {
      crop,
      market: "Local Market", // placeholder
      pricePerKg: history[history.length - 1].pricePerKg
    };
  });
  res.json(latest);
};

// History of a crop
exports.getPriceHistory = (req, res) => {
  const crop = req.params.crop.toLowerCase();
  const history = mockData[crop] || [];
  res.json(history);
};
