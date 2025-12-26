const Candidate = require("../module/candidateModel");
const ExcelJS = require("exceljs");

exports.createCandidate = async (req, res) => {
  try {
    // 🔐 Branch auto-assign
    if (req.user.role === "branchUser") {
      req.body.branch = req.user.branch;
    }

    // ✅ CHECK AADHAAR DUPLICATE
    if (req.body.aadharNumber) {
      const exists = await Candidate.findOne({
        aadharNumber: req.body.aadharNumber,
      });

      if (exists) {
        return res.status(409).json({
          success: false,
          message: "Aadhaar already registered",
        });
      }
    }

    // 📁 FILE UPLOADS
    if (req.files?.aadharFile) {
      req.body.aadharFile = req.files.aadharFile[0].path;
    }
    if (req.files?.dlFile) {
      req.body.dlFile = req.files.dlFile[0].path;
    }
    if (req.files?.otherFile) {
      req.body.otherFile = req.files.otherFile[0].path;
    }

    const candidate = new Candidate(req.body);
    await candidate.save();

    res.status(201).json({
      success: true,
      message: "Candidate created successfully",
      candidate,
    });
  } catch (error) {
    console.error("Create Candidate Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create candidate",
    });
  }
};

exports.getAllCandidates = async (req, res) => {
  try {
    let filter = {};

    // Branch user sees only own branch candidates
    if (req.user.role === "branchUser") {
      filter.branch = req.user.branch;
    }

    // ⭐ LOCATION FILTER
    if (req.query.location && req.query.location !== "") {
      filter.location = req.query.location;
    }

    // ⭐ SEARCH FILTER
    if (req.query.search && req.query.search.trim() !== "") {
      const regex = new RegExp(req.query.search, "i");
      filter.$or = [
        { name: regex },
        { contactNumber: regex },
        { aadharNumber: regex },
        { ekycRegisteredEmail: regex },
        { location: regex },
      ];
    }

    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const list = await Candidate.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Candidate.countDocuments(filter);

 
    const allLocations = await Candidate.distinct("location");

    res.status(200).json({
      success:  true,
      data: list,
      total,
      allLocations,
      page,
      limit,
    });

  } catch (error) {
    console.error("Fetch Candidates Error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch candidates" });
  }
};




exports.getCandidateById = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);

    if (!candidate)
      return res.status(404).json({ success: false, message: "Candidate not found" });

    // Branch user cannot view other branch candidates
    if (req.user.role === "branchUser" && candidate.branch.toString() !== req.user.branch) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    res.status(200).json({ success: true, data: candidate });

  } catch (error) {
    console.error("Get Candidate Error:", error.message);
    res.status(500).json({ success: false, message: "Failed to fetch candidate" });
  }
};

exports.updateCandidate = async (req, res) => {
  try {
    // ⭐ FILE UPLOADS
  if (req.files?.aadharFile) {
  req.body.aadharFile = "uploads/candidates/" + req.files.aadharFile[0].filename;
}

if (req.files?.dlFile) {
  req.body.dlFile = "uploads/candidates/" + req.files.dlFile[0].filename;
}

if (req.files?.otherFile) {
  req.body.otherFile = "uploads/candidates/" + req.files.otherFile[0].filename;
}


    // ⭐ FIX: REMOVE INVALID BRANCH VALUES
    if (
      req.body.branch === "null" ||
      req.body.branch === null ||
      req.body.branch === "" ||
      req.body.branch === undefined
    ) {
      delete req.body.branch;   // <-- THIS FIXES THE CAST ERROR
    }

    // ⭐ FIX: DO NOT REPLACE FILE WITH {}
    if (typeof req.body.aadharFile === "object") delete req.body.aadharFile;
    if (typeof req.body.dlFile === "object") delete req.body.dlFile;
    if (typeof req.body.otherFile === "object") delete req.body.otherFile;

    const updated = await Candidate.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: "Candidate not found" });
    }

    res.status(200).json({
      success: true,
      message: "Candidate updated",
      data: updated,
    });

  } catch (error) {
    console.error("Update Candidate Error:", error.message);
    res.status(500).json({ success: false, message: "Failed to update candidate" });
  }
};
  
// Delete
exports.deleteCandidate = async (req, res) => {
  try {
    const removed = await Candidate.findByIdAndDelete(req.params.id);
    if (!removed)
      return res.status(404).json({ success: false, message: "Candidate not found" });

    res.status(200).json({
      success: true,
      message: "Candidate deleted successfully"
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete candidate" });
  }
};
 

exports.exportCandidates = async (req, res) => {
  try {
    const { fromDate, toDate } = req.query;

    const start = new Date(fromDate);
    const end = new Date(toDate);
    end.setHours(23, 59, 59, 999);

    const filter = {
      createdAt: { $gte: start, $lte: end },
    };

    const candidates = await Candidate.find(filter).lean();

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Candidates List");

    // ✅ ONLY THESE COLUMNS (NO _id POSSIBLE)
    sheet.columns = [
      { header: "Name of Project", key: "project", width: 25 },
      { header: "Location", key: "location", width: 20 },
      { header: "Status", key: "status", width: 15 },
      { header: "Batch ID", key: "batchId", width: 15 },
      { header: "Candidate Name", key: "name", width: 25 },
      { header: "Father's Name", key: "fathersName", width: 25 },
      { header: "Mother's Name", key: "mothersName", width: 25 },
      { header: "Marital Status", key: "maritalStatus", width: 18 },
      { header: "Caste", key: "caste", width: 12 },
    ];

    // ❌ NO ...c ANYWHERE
    candidates.forEach((c) => {
      sheet.addRow({
        project: c.project,
        location: c.location,
        status: c.status,
        batchId: c.batchId,
        name: c.name,
        fathersName: c.fathersName,
        mothersName: c.mothersName,
        maritalStatus: c.maritalStatus,
        caste: c.caste,
      });
    });

    sheet.getRow(1).font = { bold: true };
    sheet.views = [{ state: "frozen", ySplit: 1 }];

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=Candidates List.xlsx"
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Export failed" });
  }
};
