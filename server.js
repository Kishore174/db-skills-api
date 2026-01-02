const express = require("express");
const path = require("path");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./src/Db/connect");

// Load env variables
dotenv.config();

const app = express();

/* =======================
   MIDDLEWARES
======================= */

// CORS
app.use(cors());

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ STATIC FILE SERVING (IMPORTANT)

app.use(
  "/uploads",
  express.static(path.resolve(__dirname, "uploads"))
);

/* =======================
   DATABASE CONNECTION
======================= */
connectDB();

/* =======================
   ROUTES
======================= */
const authRoute = require("./src/routes/authRoute");
const candidateRoute = require("./src/routes/candidateRoute");
const excelRoute = require("./src/routes/excelRoute");
const branchRoute = require("./src/routes/branchRoute");
const projectRoute = require("./src/routes/projectRoute");

app.use("/api/auth", authRoute);
app.use("/api/candidate", candidateRoute);
app.use("/api/excel", excelRoute);
app.use("/api/branch", branchRoute);
app.use("/api/project", projectRoute);

/* =======================
   SERVER START
======================= */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
