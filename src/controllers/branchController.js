const Branch = require("../module/branchModel");
const User = require("../module/userModel");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");

const generatePassword = (length = 10) => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$!";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

/* ===============================
   CREATE BRANCH (CENTER)
=============================== */
exports.createBranch = async (req, res) => {
  try {
    const {
      name,
      location,
      traineeName,
      mobile,
      email,
      username,
      project,
      program,
    } = req.body;

    if (!name || !location || !email || !username) {
      return res.status(400).json({
        success: false,
        message: "Name, location, email and username are required",
      });
    }

    // ❌ Check duplicate username
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Username already exists",
      });
    }

    // ✅ Create Branch
    const branch = await Branch.create({
      name,
      location,
      traineeName,
      mobile,
      email,
      username,
      project: project || "",
      program: program || "",
    });

    // 🔐 Auto password
    const plainPassword = generatePassword(10);
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    await User.create({
      username,
      password: hashedPassword,
      role: "branchUser",
      branch: branch._id,
    });
   const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});


    // 📧 Email credentials
    await transporter.sendMail({
      to: "boopalan.dbsl@gmail.com",
      subject: "New Center Login Credentials",
      html: `
        <h3>New Center Created</h3>
        <p><strong>Center:</strong> ${name}</p>
        <p><strong>Username:</strong> ${username}</p>
        <p><strong>Password:</strong> ${plainPassword}</p>
        <hr />
        <p><strong>Project:</strong> ${project || "-"}</p>
        <p><strong>Program:</strong> ${program || "-"}</p>
      `,
    });

    res.status(201).json({
      success: true,
      message: "Center created & credentials emailed",
      data: branch,
    });

  } catch (error) {
    console.error("Create Branch Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to create center",
    });
  }
};



/* ===============================
   GET ALL BRANCHES
=============================== */
exports.getAllBranches = async (req, res) => {
  try {
    const list = await Branch.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: list,
    });
  } catch (error) {
    console.error("Fetch Branch Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch branches",
    });
  }
};

/* ===============================
   GET SINGLE BRANCH
=============================== */
exports.getBranchById = async (req, res) => {
  try {
    const branch = await Branch.findById(req.params.id);

    if (!branch) {
      return res.status(404).json({
        success: false,
        message: "Branch not found",
      });
    }

    res.status(200).json({
      success: true,
      data: branch,
    });
  } catch (error) {
    console.error("Get Branch Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch branch",
    });
  }
};

/* ===============================
   UPDATE BRANCH
=============================== */
exports.updateBranch = async (req, res) => {
  try {
    const updated = await Branch.findByIdAndUpdate(
      req.params.id,
      req.body, // includes project & program
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Branch not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Branch updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error("Update Branch Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to update branch",
    });
  }
};

/* ===============================
   DELETE BRANCH
=============================== */
exports.deleteBranch = async (req, res) => {
  try {
    const removed = await Branch.findByIdAndDelete(req.params.id);

    if (!removed) {
      return res.status(404).json({
        success: false,
        message: "Branch not found",
      });
    }

    // ❌ Also delete branch user
    await User.deleteOne({ branch: req.params.id });

    res.status(200).json({
      success: true,
      message: "Branch & branch user deleted successfully",
    });
  } catch (error) {
    console.error("Delete Branch Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to delete branch",
    });
  }
};
exports.getMyBranch = async (req, res) => {
  try {
    const branch = await Branch.findById(req.user.branch);

    if (!branch) {
      return res.status(404).json({ success: false, message: "Branch not found" });
    }

    res.status(200).json({
      success: true,
      data: branch,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed" });
  }
};
