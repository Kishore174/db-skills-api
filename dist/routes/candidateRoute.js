"use strict";

var express = require("express");
var router = express.Router();
var _require = require("../controllers/candidateController"),
  createCandidate = _require.createCandidate,
  getAllCandidates = _require.getAllCandidates,
  getCandidateById = _require.getCandidateById,
  updateCandidate = _require.updateCandidate,
  deleteCandidate = _require.deleteCandidate;
var auth = require("../middileware/authMiddleware");

// Branch user can create candidates
router.post("/create", auth(["branchUser", "admin"]), createCandidate);

// Admin can see all candidates
router.get("/all", auth(["admin", "branchUser"]), getAllCandidates);

// Both admin and branch user can view their own assigned candidate
router.get("/:id", auth(["admin", "branchUser"]), getCandidateById);
router.put("/:id", auth(["admin", "branchUser"]), updateCandidate);
router["delete"]("/:id", auth(["admin"]), deleteCandidate);
module.exports = router;