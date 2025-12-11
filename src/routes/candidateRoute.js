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
const upload = require("../middileware/upload");

// ⭐ File fields accepted: aadharFile, dlFile, otherFile
const fileUpload = upload.fields([
  { name: "aadharFile", maxCount: 1 },
  { name: "dlFile", maxCount: 1 },
  { name: "otherFile", maxCount: 1 }
]);

// ⭐ CREATE — Branch user or Admin
router.post(
  "/create",
  auth(["branchUser", "admin"]),
  fileUpload,     // ← ADDED HERE
  createCandidate
);

// ⭐ GET ALL — Admin + Branch user
router.get("/all", auth(["admin", "branchUser"]), getAllCandidates);

// ⭐ GET BY ID
router.get("/:id", auth(["admin", "branchUser"]), getCandidateById);

// ⭐ UPDATE — with file uploads
router.put(
  "/:id",
  auth(["admin", "branchUser"]),
  fileUpload,      // ← ADDED HERE
  updateCandidate
);

// ⭐ DELETE only admin
router.delete("/:id", auth(["admin"]), deleteCandidate);

module.exports = router;
