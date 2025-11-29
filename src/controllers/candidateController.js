const Candidate = require("../module/candidateModel");

// Create
exports.createCandidate = async (req, res) => {
  try {
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

// Get All
exports.getAllCandidates = async (req, res) => {
  try {
    const list = await Candidate.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: list });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch candidates" });
  }
};

// Get Single
exports.getCandidateById = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);
    if (!candidate) return res.status(404).json({ success: false, message: "Candidate not found" });

    res.status(200).json({ success: true, data: candidate });
  } catch (error) {
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
