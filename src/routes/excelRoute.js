const express = require("express");
const router = express.Router();
const multer = require("multer");
const ExcelJS = require("exceljs");
const Candidate = require("../module/candidateModel");

const upload = multer({ storage: multer.memoryStorage() });

 
const headerMap = {
  "S. No.": null,
  "Project": "project",
  "Location": "location",
  "Status": "status",
  "Batch Id": "batchId",
  "Candidate Name": "name",
  "Aadharno": "aadharNumber",
  "DOB": "dob",
  "Gender": "gender",
  "Religion": "religion",
  "Vulnerability": "vulnerability",
  "Annual Income": "annualIncome",

  "Educational Qualification": "qualification",

  "Contact no of Trainee": "contactNumber",

  "Assessment Date": "assessmentDate",

  "DL No": "dlNo",
  "Licence Type": "dlType",
  "Licence Expiry Date": "licenseExpiryDate",

  "No of Dependent Family Members": "dependentFamilyMembers",

  "Candidate Status:Owner/Driver": "ownerOrDriver",

  "ABHA Number": "abha",

  "Result": "result",
  "Certificate No": "certificateNo",
  "Remarks": "remarks",

  "eKYC Remarks": "ekycRemarks",
  "eKYC Registered email ID": "ekycRegisteredEmail",

  "Bar Code": "barCode"
};



// CLEAN VALUE FUNCTION
function cleanValue(key, value) {
  if (!value) return "";

  value = value.toString().trim();

  // Remove weird characters (backticks, quotes)
  value = value.replace(/[`'"]/g, "").trim();


  if (key === "annualIncome") {
    const match = value.match(/(\d+)/);
    return match ? Number(match[1]) * 100000 : 0;
  }

  // Convert dependentFamilyMembers → Number
  if (key === "dependentFamilyMembers") {
    const num = parseInt(value.replace(/\D/g, ""));
    return isNaN(num) ? 0 : num;
  }

  // Convert Excel date (GMT)
  if (value.includes("GMT")) {
    return new Date(value).toISOString().substring(0, 10);
  }

  // Numeric conversion
  if (!isNaN(value)) return Number(value);

  return value;
}



// UPLOAD ROUTE WITH BATCH PROCESSING
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
      const raw = (cell.text || cell.value || "").toString().trim();
      console.log("HEADER FOUND:", raw);
      header[i] = headerMap[raw] || null;
    });

    // READ ALL DATA ROWS
    sheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return;

      let obj = {};

      row.eachCell((cell, i) => {
        const key = header[i];
        if (key) {
          const raw = (cell.text || cell.value || "").toString();
          obj[key] = cleanValue(key, raw);
        }
      });

      if (Object.keys(obj).length > 0) rows.push(obj);
    });

    // ==========================
    // BATCH INSERT / UPDATE
    // ==========================
    const batchSize = 200;
    let inserted = 0;
    let updated = 0;

    for (let i = 0; i < rows.length; i += batchSize) {
      const batch = rows.slice(i, i + batchSize);

      const bulkOps = batch
        .filter(r => r.aadharNumber)
        .map(r => ({
          updateOne: {
            filter: { aadharNumber: r.aadharNumber },
            update: { $set: r },
            upsert: true
          }
        }));

      if (bulkOps.length > 0) {
        const result = await Candidate.bulkWrite(bulkOps, { ordered: false });

        inserted += result.upsertedCount || 0;
        updated += result.modifiedCount || 0;
      }
    }

    res.json({
      success: true,
      message: "Excel processed successfully",
      totalRows: rows.length,
      inserted,
      updated
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
