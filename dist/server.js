"use strict";

var express = require("express");
var connectDB = require("./src/Db/connect");
var cors = require("cors");
var dotenv = require("dotenv");
dotenv.config();
var app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

// CONNECT TO DATABASE (with caching)
connectDB();
var authRoute = require("./src/routes/authRoute");
var candidateRoute = require("./src/routes/candidateRoute");
var excelRoute = require("./src/routes/excelRoute");
var branchRoute = require("./src/routes/branchRoute");
app.use("/api/branch", branchRoute);
app.use("/api/auth", authRoute);
app.use("/api/candidate", candidateRoute);
app.use("/api/excel", excelRoute);
var PORT = process.env.PORT || 5000;
app.listen(PORT, function () {
  return console.log("Server running on port ".concat(PORT));
});