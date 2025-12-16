const Project = require("../module/projectModel");

/**
 * CREATE PROJECT
 */
exports.createProject = async (req, res) => {
  try {
    const { projectName, programName } = req.body;

    if (!projectName || !programName) {
      return res.status(400).json({
        success: false,
        message: "Project name and program name are required",
      });
    }

    const newProject = new Project({
      projectName,
      programName,
      createdBy: req.user.id,
      branch: req.user.branch || null,
    });

    await newProject.save();

    res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: newProject,
    });
  } catch (error) {
    console.error("Create project error:", error.message);
    res.status(500).json({ success: false, message: "Failed to create project" });
  }
};

/**
 * PROJECT STATS (COUNT)
 */
exports.getProjectStats = async (req, res) => {
  try {
    const uniqueProjects = await Project.distinct("projectName");
    const uniquePrograms = await Project.distinct("programName");

    res.status(200).json({
      success: true,
      data: {
        totalProjects: uniqueProjects.length,
        totalPrograms: uniquePrograms.length,
      },
    });
  } catch (error) {
    console.error("Project stats error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch project stats",
    });
  }
};

/**
 * GET ALL PROJECT NAMES
 */
exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find({}, { projectName: 1, _id: 0 });

    res.status(200).json({
      success: true,
      data: projects,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch projects",
    });
  }
};
/**
 * GET PROGRAMS BY PROJECT NAME
 */
exports.getProgramsByProject = async (req, res) => {
  try {
    const { projectName } = req.params;

    const programs = await Project.distinct("programName", {
      projectName,
    });

    res.status(200).json({
      success: true,
      data: programs,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed" });
  }
};
exports.getAllProgramsByProject = async (req, res) => {
  try {
    const projects = await Project.find(
      {},
      { projectName: 1, programName: 1, _id: 0 }
    );

    const result = {};

    projects.forEach((p) => {
      if (!result[p.projectName]) {
        result[p.projectName] = new Set();
      }
      result[p.projectName].add(p.programName);
    });

    Object.keys(result).forEach((key) => {
      result[key] = Array.from(result[key]);
    });

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({ success: false });
  }
};

exports.getBranchProjects = async (req, res) => {
  try {
    let filter = {};

    // Branch user → only their branch
    if (req.user.role === "branchUser") {
      filter.branch = req.user.branch;
    }

    const projects = await Project.distinct("projectName", filter);

    res.status(200).json({
      success: true,
      data: projects
    });

  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch projects" });
  }
};
