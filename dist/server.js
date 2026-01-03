"use strict";

var express = require("express");
var path = require("path");
var cors = require("cors");
var dotenv = require("dotenv");
var connectDB = require("./src/Db/connect");

// Load environment variables
dotenv.config();
var app = express();

/* =======================
   MIDDLEWARES
======================= */

// Enable CORS
app.use(cors());

// Body parsers
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

/*
 ⚠️ NOTE:
 We keep static uploads for LOCAL testing only.
 ❌ Do NOT use /uploads directly in frontend links when using ngrok.
*/
app.use("/uploads", express["static"](path.join(__dirname, "uploads")));

/* =======================
   DATABASE CONNECTION
======================= */
connectDB();

/* =======================
   ROUTES
======================= */

// Auth & main routes
var authRoute = require("./src/routes/authRoute");
var candidateRoute = require("./src/routes/candidateRoute");
var excelRoute = require("./src/routes/excelRoute");
var branchRoute = require("./src/routes/branchRoute");
var projectRoute = require("./src/routes/projectRoute");

// ✅ FILE OPEN ROUTE (IMPORTANT FOR NGROK)
var fileRoute = require("./src/routes/fileRoute");
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
app.get("/", function (req, res) {
  res.send("✅ Server is running");
});

/* =======================
   SERVER START
======================= */
var PORT = process.env.PORT || 5000;
app.listen(PORT, function () {
  console.log("\uD83D\uDE80 Server running on port ".concat(PORT));
});