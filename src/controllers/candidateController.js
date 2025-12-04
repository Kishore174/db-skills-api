const Candidate = require("../module/candidateModel");

exports.createCandidate = async (req, res) => {
  try {
    // Branch user → auto assign branch ID from token
    if (req.user.role === "branchUser") {
      req.body.branch = req.user.branch;
    }

    const candidate = new Candidate(req.body);
    await candidate.save();

    res.status(201).json({
      success: true,
      message: "Candidate created",
      candidate
    });
  } catch (error) {
    console.error("Create Candidate Error:", error.message);
    res.status(500).json({ success: false, message: "Failed to create candidate" });
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

    // Unique locations (for dropdown)
    const allLocations = await Candidate.distinct("location");

    res.status(200).json({
      success: true,
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


// Update
exports.updateCandidate = async (req, res) => {
  try {
    const updated = await Candidate.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updated) return res.status(404).json({ success: false, message: "Candidate not found" });

    res.status(200).json({
      success: true,
      message: "Candidate updated",
      data: updated
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
