const express = require("express");
const router = express.Router();
const multer = require("multer");
const ExcelJS = require("exceljs");
const Candidate = require("../module/candidateModel");

// Upload in memory only
const upload = multer({ storage: multer.memoryStorage() });

// MAP EXCEL HEADERS → MONGODB SCHEMA FIELDS
const headerMap = {
  "Sr No": "srNo",
  "Location": "location",
  "NAME": "name",
  "AADHAR NUMBER": "aadharNumber",
  "DOB": "dob",
  "Gender": "gender",
  "Religion": "religion",
  "Vulnerability": "vulnerability",
  "Annual Income": "annualIncome",
  "QUALIFICATION": "qualification",
  "Contact no of Trainee": "contactNumber",
  "Assessment Date": "assessmentDate",
  "DL No": "dlNo",
  "DL Type": "dlType",
  "LICENSE EXPIRY DATE": "licenseExpiryDate",
  "No. Of Dependent Family Members": "dependentFamilyMembers",
  "Owner / Driver": "ownerOrDriver",
  "ABHA": "abha",
  "Job Role": "jobRole",
  "Job code": "jobCode",
  "Email Address of Trainee": "email",
  "You Tube": "youtube",
  "FACEBOOK": "facebook",
  "Instagram": "instagram",
  "EKYC REMARKS": "ekycRemarks"
};

// Convert values safely
function cleanValue(key, value) {
  if (!value) return "";

  value = value.toString().trim();

  // Convert income: "1 Lac-4 Lac" → 100000
  if (key === "annualIncome") {
    const match = value.match(/(\d+)/);
    return match ? Number(match[1]) * 100000 : 0;
  }

  // Convert dates to ISO yyyy-mm-dd
  if (value.includes("GMT")) {
    return new Date(value).toISOString().substring(0, 10);
  }

  // Convert numbers
  if (!isNaN(value)) return Number(value);

  return value;
}

router.post("/upload-exceljs", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(req.file.buffer);

    const sheet = workbook.worksheets[0];
    if (!sheet) {
      return res.status(400).json({ success: false, message: "Worksheet not found" });
    }

    const header = [];
    const rows = [];

    // READ HEADER ROW
    sheet.getRow(1).eachCell((cell, i) => {
      const raw = cell.text?.trim() || cell.value;
      header[i] = headerMap[raw] || null;
    });

    // READ ALL DATA ROWS
    sheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return;

      let obj = {};

      row.eachCell((cell, i) => {
        const key = header[i];
        if (key) obj[key] = cleanValue(key, cell.text || cell.value);
      });

      if (Object.keys(obj).length > 0) rows.push(obj);
    });

    // INSERT OR UPDATE
    const inserted = [];
    const updated = [];

    for (const row of rows) {
      if (!row.aadharNumber) continue;

      const existing = await Candidate.findOne({ aadharNumber: row.aadharNumber });

      if (existing) {
        await Candidate.updateOne(
          { aadharNumber: row.aadharNumber },
          { $set: row }
        );
        updated.push(row);
      } else {
        await Candidate.create(row);
        inserted.push(row);
      }
    }

    res.json({
      success: true,
      message: "Excel processed successfully",
      totalRows: rows.length,
      inserted: inserted.length,
      updated: updated.length
    });

  } catch (error) {
    console.error("Excel import error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to process Excel",
      error: error.message
    });
  }
});

module.exports = router;
