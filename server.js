const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

const authRoute = require("./src/routes/authRoute");
const candidateRoute = require("./src/routes/candidateRoute");
const excelRoute = require("./src/routes/excelRoute");

app.use("/api/auth", authRoute);
app.use("/api/candidate", candidateRoute);
app.use("/api/excel", excelRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
