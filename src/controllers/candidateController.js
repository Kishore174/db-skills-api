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
    const list = await Candidate.find();
    res.status(200).json({ success: true, data: list });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch candidates" });
  }
};
