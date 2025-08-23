// backend/server.js
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

dotenv.config();

const app = express();

// ✅ CORS
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

// ✅ Parse JSON
app.use(express.json());

// ✅ MongoDB connection
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/agriconnect";
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Routes
const equipmentRoutes = require("./routes/equipmentRoutes");
const authRoutes = require("./routes/authRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const priceRoutes = require("./routes/priceRoutes"); // ✅ added

app.use("/api/equipment", equipmentRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/prices", priceRoutes); // ✅ mounted

// ✅ Root
app.get("/", (req, res) => res.send("AgriConnect API running"));

// ✅ Serve frontend
app.use(express.static(path.join(__dirname, "public")));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));

const priceRoutes = require("./routes/priceRoutes");
app.use("/api/prices", priceRoutes);
