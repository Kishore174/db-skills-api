"use strict";

var express = require("express");
var router = express.Router();
var auth = require("../middileware/authMiddleware");
var _require = require("../controllers/branchController"),
  createBranch = _require.createBranch,
  getAllBranches = _require.getAllBranches,
  getBranchById = _require.getBranchById,
  updateBranch = _require.updateBranch,
  deleteBranch = _require.deleteBranch,
  getMyBranch = _require.getMyBranch;

// Admin only
router.get("/me", auth(["branchUser"]), getMyBranch);
router.post("/create", auth(["admin"]), createBranch);
router.get("/all", auth(["admin"]), getAllBranches);
router.get("/:id", auth(["admin"]), getBranchById);
router.put("/:id", auth(["admin"]), updateBranch);
router["delete"]("/:id", auth(["admin"]), deleteBranch);
module.exports = router;