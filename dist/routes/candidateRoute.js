"use strict";

var express = require("express");
var router = express.Router();
var _require = require("../controllers/candidateController"),
  createCandidate = _require.createCandidate,
  getAllCandidates = _require.getAllCandidates,
  getCandidateById = _require.getCandidateById,
  updateCandidate = _require.updateCandidate,
  deleteCandidate = _require.deleteCandidate,
  exportCandidates = _require.exportCandidates;
var auth = require("../middileware/authMiddleware");
var upload = require("../middileware/upload");

// ⭐ File fields accepted
var fileUpload = upload.fields([{
  name: "aadharFile",
  maxCount: 1
}, {
  name: "dlFile",
  maxCount: 1
}, {
  name: "otherFile",
  maxCount: 1
}]);

// ⭐ CREATE
router.post("/create", auth(["branchUser", "admin"]), fileUpload, createCandidate);

// ⭐ EXPORT (🔥 MUST BE ABOVE /:id)
router.get("/export", auth(["admin", "branchUser"]), exportCandidates);

// ⭐ GET ALL
router.get("/all", auth(["admin", "branchUser"]), getAllCandidates);

// ⭐ GET BY ID (ALWAYS LAST)
router.get("/:id", auth(["admin", "branchUser"]), getCandidateById);

// ⭐ UPDATE
router.put("/:id", auth(["admin", "branchUser"]), fileUpload, updateCandidate);

// ⭐ DELETE
router["delete"]("/:id", auth(["admin"]), deleteCandidate);
module.exports = router;