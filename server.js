const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

// Load environment variables
dotenv.config();

// Import routes
const equipmentRoutes = require("./routes/equipmentRoutes");
const authRoutes = require("./routes/authRoutes");

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

// Initialize Express app
const App = express();

// Middleware
App.use(cors());
App.use(express.json());

// Routes
App.use("/api/equipment", equipmentRoutes);
App.use("/api/auth", authRoutes);

// Root route
App.get("/", (req, res) => {
  res.send("AgriConnect API is running");
});

// Start server
const PORT = process.env.PORT || 5000;
App.listen(PORT, () => console.log(`Server running on port ${PORT}`));

app.use("/api/payment", require("./routes/paymentRoutes"));

// server.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected ✅"))
  .catch(err => console.log("MongoDB connection error:", err));

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/prices", require("./routes/priceRoutes"));

// Root route
app.get("/", (req, res) => res.send("AgriConnect API running"));

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));

import paymentRoutes from "./routes/paymentRoutes.js";
import paymentWebhook from "./routes/paymentWebhook.js";

app.use("/api/payments", paymentRoutes);
app.use("/api/payments", paymentWebhook);
