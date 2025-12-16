"use strict";

var express = require("express");
var router = express.Router();
var auth = require("../middileware/authMiddleware");
var _require = require("../controllers/projectController"),
  createProject = _require.createProject,
  getProjectStats = _require.getProjectStats,
  getAllProjects = _require.getAllProjects,
  getProgramsByProject = _require.getProgramsByProject,
  getBranchProjects = _require.getBranchProjects,
  getAllProgramsByProject = _require.getAllProgramsByProject;
router.post("/", auth(["admin"]), createProject);
router.get("/stats", auth(["admin", "branchUser"]), getProjectStats);
router.get("/", auth(["admin", "branchUser"]), getAllProjects);
router.get("/branch-projects", auth(["admin", "branchUser"]), getBranchProjects);
router.get("/:projectName/programs", auth(["admin", "branchUser"]), getProgramsByProject);
router.get("/all-programs", auth(["admin", "branchUser"]), getAllProgramsByProject);
module.exports = router;