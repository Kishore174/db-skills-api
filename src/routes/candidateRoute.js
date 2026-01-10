const express = require("express");
const router = express.Router();

const Candidate = require("../module/candidateModel");

const {
  createCandidate,
  getAllCandidates,
  getCandidateById,
  updateCandidate,
  deleteCandidate,
  exportCandidates,
  approveCandidate,
  getProjectWiseCount,
  getProgramWiseCount
} = require("../controllers/candidateController");

const auth = require("../middileware/authMiddleware");
const upload = require("../middileware/upload");

// ⭐ File fields accepted
const fileUpload = upload.fields([
  { name: "aadharFile", maxCount: 1 },
  { name: "dlFile", maxCount: 1 },
  { name: "otherFile", maxCount: 1 }
]);

// ⭐ CREATE (branchUser + admin)
router.post(
  "/create",
  auth(["branchUser", "admin"]),
  fileUpload,
  createCandidate
);

// ⭐ APPROVE (ADMIN ONLY)
router.put(
  "/approve/:id",
  auth(["admin"]),
  approveCandidate
);

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
// routes/candidateRoutes.js
router.get(
  "/project-count",
  auth(["admin", "branchUser"]),
  getProjectWiseCount
);
// routes/candidateRoutes.js
router.get(
  "/program-count",
  auth(["admin", "branchUser"]),
  getProgramWiseCount
);

// ⭐ GET ALL
router.get(
  "/all",
  auth(["admin", "branchUser"]),
  getAllCandidates
);

router.get(
  "/:id",
  auth(["admin", "branchUser"]),
  getCandidateById
);

 router.put(
  "/:id",
  auth(["admin", "branchUser"]),
  fileUpload,
  updateCandidate
);

 
router.delete(
  "/:id",
  auth(["admin"]),
  deleteCandidate
);

module.exports = router;
