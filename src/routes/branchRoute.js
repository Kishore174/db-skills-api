const express = require("express");
const router = express.Router();
const auth = require("../middileware/authMiddleware");

const {
  createBranch,
  getAllBranches,
  getBranchById,
  updateBranch,
  deleteBranch,
  getMyBranch
} = require("../controllers/branchController");

// Admin only
router.get("/me", auth(["branchUser"]), getMyBranch);

router.post("/create", auth(["admin"]), createBranch);
router.get("/all", auth(["admin"]), getAllBranches);
router.get("/:id", auth(["admin"]), getBranchById);
router.put("/:id", auth(["admin"]), updateBranch);
router.delete("/:id", auth(["admin"]), deleteBranch);

module.exports = router;
