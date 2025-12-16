const express = require("express");
const router = express.Router();
const auth = require("../middileware/authMiddleware");

const {
  createProject,
  getProjectStats,
  getAllProjects,
  getProgramsByProject,
  getBranchProjects,
  getAllProgramsByProject,
} = require("../controllers/projectController");

router.post("/", auth(["admin"]), createProject);

router.get("/stats", auth(["admin", "branchUser"]), getProjectStats);

router.get("/", auth(["admin", "branchUser"]), getAllProjects);
router.get(
  "/branch-projects",
  auth(["admin", "branchUser"]),
  getBranchProjects
);

router.get(
  "/:projectName/programs",
  auth(["admin", "branchUser"]),
  getProgramsByProject
);

router.get(
  "/all-programs",
  auth(["admin", "branchUser"]),
  getAllProgramsByProject
);

module.exports = router;
