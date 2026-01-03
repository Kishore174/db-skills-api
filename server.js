const express = require("express");
const path = require("path");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./src/Db/connect");

// Load environment variables
dotenv.config();

const app = express();

/* =======================
   MIDDLEWARES
======================= */

// Enable CORS
app.use(cors());

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/*
 ⚠️ NOTE:
 We keep static uploads for LOCAL testing only.
 ❌ Do NOT use /uploads directly in frontend links when using ngrok.
*/
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

/* =======================
   DATABASE CONNECTION
======================= */
connectDB();

/* =======================
   ROUTES
======================= */

// Auth & main routes
const authRoute = require("./src/routes/authRoute");
const candidateRoute = require("./src/routes/candidateRoute");
const excelRoute = require("./src/routes/excelRoute");
const branchRoute = require("./src/routes/branchRoute");
const projectRoute = require("./src/routes/projectRoute");

// ✅ FILE OPEN ROUTE (IMPORTANT FOR NGROK)
const fileRoute = require("./src/routes/fileRoute");

app.use("/api/auth", authRoute);
app.use("/api/candidate", candidateRoute);
app.use("/api/excel", excelRoute);
app.use("/api/branch", branchRoute);
app.use("/api/project", projectRoute);

// ✅ USE THIS FOR OPENING PDFs / IMAGES
app.use("/api/file", fileRoute);

/* =======================
   HEALTH CHECK
======================= */
app.get("/", (req, res) => {
  res.send("✅ Server is running");
});

/* =======================
   SERVER START
======================= */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
