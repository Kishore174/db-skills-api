const express = require("express");
const router = express.Router();
const {
  createCandidate,
  getAllCandidates,
  getCandidateById,
  updateCandidate,
  deleteCandidate
} = require("../controllers/candidateController");

router.post("/create", createCandidate);
router.get("/all", getAllCandidates);
router.get("/:id", getCandidateById);        // Get single
router.put("/:id", updateCandidate);         // Edit
router.delete("/:id", deleteCandidate);      // Delete

module.exports = router;
