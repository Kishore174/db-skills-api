"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var express = require("express");
var router = express.Router();
var multer = require("multer");
var ExcelJS = require("exceljs");
var Candidate = require("../module/candidateModel");

// Upload in memory only
var upload = multer({
  storage: multer.memoryStorage()
});

// MAP EXCEL HEADERS → MONGODB SCHEMA FIELDS
var headerMap = {
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
    var match = value.match(/(\d+)/);
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
router.post("/upload-exceljs", upload.single("file"), /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee(req, res) {
    var workbook, sheet, header, rows, inserted, updated, _i, _rows, row, existing;
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
            var _cell$text;
            var raw = ((_cell$text = cell.text) === null || _cell$text === void 0 ? void 0 : _cell$text.trim()) || cell.value;
            header[i] = headerMap[raw] || null;
          });

          // READ ALL DATA ROWS
          sheet.eachRow(function (row, rowNumber) {
            if (rowNumber === 1) return;
            var obj = {};
            row.eachCell(function (cell, i) {
              var key = header[i];
              if (key) obj[key] = cleanValue(key, cell.text || cell.value);
            });
            if (Object.keys(obj).length > 0) rows.push(obj);
          });

          // INSERT OR UPDATE
          inserted = [];
          updated = [];
          _i = 0, _rows = rows;
        case 16:
          if (!(_i < _rows.length)) {
            _context.next = 35;
            break;
          }
          row = _rows[_i];
          if (row.aadharNumber) {
            _context.next = 20;
            break;
          }
          return _context.abrupt("continue", 32);
        case 20:
          _context.next = 22;
          return Candidate.findOne({
            aadharNumber: row.aadharNumber
          });
        case 22:
          existing = _context.sent;
          if (!existing) {
            _context.next = 29;
            break;
          }
          _context.next = 26;
          return Candidate.updateOne({
            aadharNumber: row.aadharNumber
          }, {
            $set: row
          });
        case 26:
          updated.push(row);
          _context.next = 32;
          break;
        case 29:
          _context.next = 31;
          return Candidate.create(row);
        case 31:
          inserted.push(row);
        case 32:
          _i++;
          _context.next = 16;
          break;
        case 35:
          res.json({
            success: true,
            message: "Excel processed successfully",
            totalRows: rows.length,
            inserted: inserted.length,
            updated: updated.length
          });
          _context.next = 42;
          break;
        case 38:
          _context.prev = 38;
          _context.t0 = _context["catch"](0);
          console.error("Excel import error:", _context.t0);
          return _context.abrupt("return", res.status(500).json({
            success: false,
            message: "Failed to process Excel",
            error: _context.t0.message
          }));
        case 42:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[0, 38]]);
  }));
  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}());
module.exports = router;