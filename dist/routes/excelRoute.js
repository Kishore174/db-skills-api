"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var express = require("express");
var router = express.Router();
var multer = require("multer");
var ExcelJS = require("exceljs");
var Candidate = require("../module/candidateModel");
var upload = multer({
  storage: multer.memoryStorage()
});
var headerMap = {
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
    var match = value.match(/(\d+)/);
    return match ? Number(match[1]) * 100000 : 0;
  }

  // Convert dependentFamilyMembers → Number
  if (key === "dependentFamilyMembers") {
    var num = parseInt(value.replace(/\D/g, ""));
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
router.post("/upload-exceljs", upload.single("file"), /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee(req, res) {
    var workbook, sheet, header, rows, batchSize, inserted, updated, i, batch, bulkOps, result;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          if (req.file) {
            _context.next = 3;
            break;
          }
          return _context.abrupt("return", res.status(400).json({
            success: false,
            message: "No file uploaded"
          }));
        case 3:
          workbook = new ExcelJS.Workbook();
          _context.next = 6;
          return workbook.xlsx.load(req.file.buffer);
        case 6:
          sheet = workbook.worksheets[0];
          if (sheet) {
            _context.next = 9;
            break;
          }
          return _context.abrupt("return", res.status(400).json({
            success: false,
            message: "Worksheet not found"
          }));
        case 9:
          header = [];
          rows = []; // READ HEADER ROW
          sheet.getRow(1).eachCell(function (cell, i) {
            var raw = (cell.text || cell.value || "").toString().trim();
            console.log("HEADER FOUND:", raw);
            header[i] = headerMap[raw] || null;
          });

          // READ ALL DATA ROWS
          sheet.eachRow(function (row, rowNumber) {
            if (rowNumber === 1) return;
            var obj = {};
            row.eachCell(function (cell, i) {
              var key = header[i];
              if (key) {
                var raw = (cell.text || cell.value || "").toString();
                obj[key] = cleanValue(key, raw);
              }
            });
            if (Object.keys(obj).length > 0) rows.push(obj);
          });

          // ==========================
          // BATCH INSERT / UPDATE
          // ==========================
          batchSize = 200;
          inserted = 0;
          updated = 0;
          i = 0;
        case 17:
          if (!(i < rows.length)) {
            _context.next = 29;
            break;
          }
          batch = rows.slice(i, i + batchSize);
          bulkOps = batch.filter(function (r) {
            return r.aadharNumber;
          }).map(function (r) {
            return {
              updateOne: {
                filter: {
                  aadharNumber: r.aadharNumber
                },
                update: {
                  $set: r
                },
                upsert: true
              }
            };
          });
          if (!(bulkOps.length > 0)) {
            _context.next = 26;
            break;
          }
          _context.next = 23;
          return Candidate.bulkWrite(bulkOps, {
            ordered: false
          });
        case 23:
          result = _context.sent;
          inserted += result.upsertedCount || 0;
          updated += result.modifiedCount || 0;
        case 26:
          i += batchSize;
          _context.next = 17;
          break;
        case 29:
          res.json({
            success: true,
            message: "Excel processed successfully",
            totalRows: rows.length,
            inserted: inserted,
            updated: updated
          });
          _context.next = 36;
          break;
        case 32:
          _context.prev = 32;
          _context.t0 = _context["catch"](0);
          console.error("Excel import error:", _context.t0);
          return _context.abrupt("return", res.status(500).json({
            success: false,
            message: "Failed to process Excel",
            error: _context.t0.message
          }));
        case 36:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[0, 32]]);
  }));
  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}());
module.exports = router;