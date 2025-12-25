const express = require("express");
const router = express.Router();

const Candidate = require("../module/candidateModel"); // ✅ FIX ADDED

const {
  createCandidate,
  getAllCandidates,
  getCandidateById,
  updateCandidate,
  deleteCandidate,
  exportCandidates
} = require("../controllers/candidateController");

const auth = require("../middileware/authMiddleware");
const upload = require("../middileware/upload");

// ⭐ File fields accepted
const fileUpload = upload.fields([
  { name: "aadharFile", maxCount: 1 },
  { name: "dlFile", maxCount: 1 },
  { name: "otherFile", maxCount: 1 }
]);

// ⭐ CREATE
router.post(
  "/create",
  auth(["branchUser", "admin"]),
  fileUpload,
  createCandidate
);

// ⭐ CHECK AADHAAR DUPLICATE (MUST BE ABOVE /:id)
router.get(
  "/check-aadhar/:aadhar",
  auth(["admin", "branchUser"]),
  async (req, res) => {
    try {
      const candidate = await Candidate.findOne({
        aadharNumber: req.params.aadhar,
      });

      if (candidate) {
        return res.json({ exists: true, candidate });
      }

      res.json({ exists: false });
    } catch (err) {
      console.error("Check Aadhaar Error:", err);
      res.status(500).json({ message: "Aadhaar check failed" });
    }
  }
);

// ⭐ EXPORT
router.get(
  "/export",
  auth(["admin", "branchUser"]),
  exportCandidates
);

// ⭐ GET ALL
router.get(
  "/all",
  auth(["admin", "branchUser"]),
  getAllCandidates
);

// ⭐ GET BY ID (ALWAYS LAST)
router.get(
  "/:id",
  auth(["admin", "branchUser"]),
  getCandidateById
);

// ⭐ UPDATE
router.put(
  "/:id",
  auth(["admin", "branchUser"]),
  fileUpload,
  updateCandidate
);

// ⭐ DELETE
router.delete(
  "/:id",
  auth(["admin"]),
  deleteCandidate
);

module.exports = router;
