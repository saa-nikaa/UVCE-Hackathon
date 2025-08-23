const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const equipmentRoutes = require("./routes/equipmentRoutes");
dotenv.config();

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("DB connected"))
  .catch(err => console.log(err));

app.use("/api/equipment", equipmentRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
