"use strict";

var express = require("express");
var router = express.Router();
var _require = require("../controllers/candidateController"),
  createCandidate = _require.createCandidate,
  getAllCandidates = _require.getAllCandidates;
router.post("/create", createCandidate);
router.get("/all", getAllCandidates);
module.exports = router;