const express = require("express");
const router = express.Router();
const {
  createCandidate,
  getAllCandidates,
  getCandidateById,
  updateCandidate,
  deleteCandidate
} = require("../controllers/candidateController");

const auth = require("../middileware/authMiddleware");

// Branch user can create candidates
router.post("/create", auth(["branchUser", "admin"]), createCandidate);

// Admin can see all candidates
router.get("/all", auth(["admin", "branchUser"]), getAllCandidates);


// Both admin and branch user can view their own assigned candidate
router.get("/:id", auth(["admin", "branchUser"]), getCandidateById);

router.put("/:id", auth(["admin", "branchUser"]), updateCandidate);

router.delete("/:id", auth(["admin"]), deleteCandidate);

module.exports = router;
