"use strict";

var express = require("express");
var path = require("path");
var cors = require("cors");
var dotenv = require("dotenv");
var connectDB = require("./src/Db/connect");

// Load env variables
dotenv.config();
var app = express();

/* =======================
   MIDDLEWARES
======================= */

// CORS
app.use(cors());

// Body parsers
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

// ✅ STATIC FILE SERVING (IMPORTANT)

app.use("/uploads", express["static"](path.resolve(__dirname, "uploads")));

/* =======================
   DATABASE CONNECTION
======================= */
connectDB();

/* =======================
   ROUTES
======================= */
var authRoute = require("./src/routes/authRoute");
var candidateRoute = require("./src/routes/candidateRoute");
var excelRoute = require("./src/routes/excelRoute");
var branchRoute = require("./src/routes/branchRoute");
var projectRoute = require("./src/routes/projectRoute");
app.use("/api/auth", authRoute);
app.use("/api/candidate", candidateRoute);
app.use("/api/excel", excelRoute);
app.use("/api/branch", branchRoute);
app.use("/api/project", projectRoute);

/* =======================
   SERVER START
======================= */
var PORT = process.env.PORT || 5000;
app.listen(PORT, function () {
  console.log("\uD83D\uDE80 Server running on port ".concat(PORT));
});