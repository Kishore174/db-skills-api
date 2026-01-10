const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const csv = require("csv-parser");
const Candidate = require("../module/candidateModel");

const upload = multer({ dest: "uploads/" });

// 🔹 Normalize project names
const projectMap = {
  "Linde Hazmat": "Linde",
  "Linde Upskilling": "Linde",
  "SSSF Upskilling": "Shriram Finance",
};

// 🔹 Project → Program mapping
const programMap = {
  "Linde Hazmat": "Hazardous (Hydrogen Tanker) Training Program",
  "SSSF Upskilling": "One Day Refresher Program",
  "Linde Upskilling": "One Day Refresher Program",
};

router.post("/upload-csv", upload.single("file"), async (req, res) => {
  const BATCH_SIZE = 2000;
  let batch = [];
  let inserted = 0;
  let skipped = 0;
  let totalRows = 0;

  const stream = fs.createReadStream(req.file.path).pipe(csv());

  for await (const row of stream) {
    totalRows++;

    const rawProject = row.Project?.trim() || "";

    // ✅ Normalize project
    const project = projectMap[rawProject] || rawProject;

    // ✅ Assign program based on original project
    const program = programMap[rawProject] || "";

    const aadharNumber = row.Aadharno
      ? row.Aadharno.toString().replace(/\D/g, "")
      : "";

    if (aadharNumber.length !== 12) {
      skipped++;
      continue;
    }

    batch.push({
      project,
      program,
      aadharNumber,
      approvalstatus: "Approved",
      approvalReason: "Auto approved via bulk upload",
    });

    if (batch.length === BATCH_SIZE) {
      inserted += await insertBatch(batch);
      batch = [];
    }
  }

  if (batch.length) {
    inserted += await insertBatch(batch);
  }

  fs.unlinkSync(req.file.path); // cleanup

  res.json({
    success: true,
    message: "CSV uploaded successfully",
    totalRows,
    inserted,
    skipped,
  });
});

async function insertBatch(rows) {
  try {
    await Candidate.insertMany(rows, { ordered: false });
    return rows.length;
  } catch (err) {
    return err.insertedDocs?.length || 0;
  }
}

module.exports = router;
