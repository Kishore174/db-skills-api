const express = require("express");
const router = express.Router();
const { createCandidate, getAllCandidates } = require("../controllers/candidateController");

router.post("/create", createCandidate);
router.get("/all", getAllCandidates);

module.exports = router;
