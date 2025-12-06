const express = require("express");
const connectDB = require("./src/Db/connect");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CONNECT TO DATABASE (with caching)
connectDB();

const authRoute = require("./src/routes/authRoute");
const candidateRoute = require("./src/routes/candidateRoute");
const excelRoute = require("./src/routes/excelRoute");
const branchRoute = require("./src/routes/branchRoute");

app.use("/api/branch", branchRoute);
app.use("/api/auth", authRoute);
app.use("/api/candidate", candidateRoute);
app.use("/api/excel", excelRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
