"use strict";

var express = require("express");
var router = express.Router();
var _require = require("../controllers/candidateController"),
  createCandidate = _require.createCandidate,
  getAllCandidates = _require.getAllCandidates,
  getCandidateById = _require.getCandidateById,
  updateCandidate = _require.updateCandidate,
  deleteCandidate = _require.deleteCandidate;
router.post("/create", createCandidate);
router.get("/all", getAllCandidates);
router.get("/:id", getCandidateById); // Get single
router.put("/:id", updateCandidate); // Edit
router["delete"]("/:id", deleteCandidate); // Delete

module.exports = router;