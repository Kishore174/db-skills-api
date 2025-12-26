"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var Candidate = require("../module/candidateModel");
var ExcelJS = require("exceljs");
exports.createCandidate = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee(req, res) {
    var _req$files, _req$files2, _req$files3, exists, candidate;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          // 🔐 Branch auto-assign
          if (req.user.role === "branchUser") {
            req.body.branch = req.user.branch;
          }

          // ✅ CHECK AADHAAR DUPLICATE
          if (!req.body.aadharNumber) {
            _context.next = 8;
            break;
          }
          _context.next = 5;
          return Candidate.findOne({
            aadharNumber: req.body.aadharNumber
          });
        case 5:
          exists = _context.sent;
          if (!exists) {
            _context.next = 8;
            break;
          }
          return _context.abrupt("return", res.status(409).json({
            success: false,
            message: "Aadhaar already registered"
          }));
        case 8:
          // 📁 FILE UPLOADS
          if ((_req$files = req.files) !== null && _req$files !== void 0 && _req$files.aadharFile) {
            req.body.aadharFile = req.files.aadharFile[0].path;
          }
          if ((_req$files2 = req.files) !== null && _req$files2 !== void 0 && _req$files2.dlFile) {
            req.body.dlFile = req.files.dlFile[0].path;
          }
          if ((_req$files3 = req.files) !== null && _req$files3 !== void 0 && _req$files3.otherFile) {
            req.body.otherFile = req.files.otherFile[0].path;
          }
          candidate = new Candidate(req.body);
          _context.next = 14;
          return candidate.save();
        case 14:
          res.status(201).json({
            success: true,
            message: "Candidate created successfully",
            candidate: candidate
          });
          _context.next = 21;
          break;
        case 17:
          _context.prev = 17;
          _context.t0 = _context["catch"](0);
          console.error("Create Candidate Error:", _context.t0);
          res.status(500).json({
            success: false,
            message: "Failed to create candidate"
          });
        case 21:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[0, 17]]);
  }));
  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();
exports.getAllCandidates = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res) {
    var filter, regex, page, limit, skip, list, total, allLocations;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          filter = {}; // Branch user sees only own branch candidates
          if (req.user.role === "branchUser") {
            filter.branch = req.user.branch;
          }

          // ⭐ LOCATION FILTER
          if (req.query.location && req.query.location !== "") {
            filter.location = req.query.location;
          }

          // ⭐ SEARCH FILTER
          if (req.query.search && req.query.search.trim() !== "") {
            regex = new RegExp(req.query.search, "i");
            filter.$or = [{
              name: regex
            }, {
              contactNumber: regex
            }, {
              aadharNumber: regex
            }, {
              ekycRegisteredEmail: regex
            }, {
              location: regex
            }];
          }

          // Pagination
          page = parseInt(req.query.page) || 1;
          limit = parseInt(req.query.limit) || 10;
          skip = (page - 1) * limit;
          _context2.next = 10;
          return Candidate.find(filter).sort({
            createdAt: -1
          }).skip(skip).limit(limit).lean();
        case 10:
          list = _context2.sent;
          _context2.next = 13;
          return Candidate.countDocuments(filter);
        case 13:
          total = _context2.sent;
          _context2.next = 16;
          return Candidate.distinct("location");
        case 16:
          allLocations = _context2.sent;
          res.status(200).json({
            success: true,
            data: list,
            total: total,
            allLocations: allLocations,
            page: page,
            limit: limit
          });
          _context2.next = 24;
          break;
        case 20:
          _context2.prev = 20;
          _context2.t0 = _context2["catch"](0);
          console.error("Fetch Candidates Error:", _context2.t0);
          res.status(500).json({
            success: false,
            message: "Failed to fetch candidates"
          });
        case 24:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[0, 20]]);
  }));
  return function (_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();
exports.getCandidateById = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res) {
    var candidate;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return Candidate.findById(req.params.id);
        case 3:
          candidate = _context3.sent;
          if (candidate) {
            _context3.next = 6;
            break;
          }
          return _context3.abrupt("return", res.status(404).json({
            success: false,
            message: "Candidate not found"
          }));
        case 6:
          if (!(req.user.role === "branchUser" && candidate.branch.toString() !== req.user.branch)) {
            _context3.next = 8;
            break;
          }
          return _context3.abrupt("return", res.status(403).json({
            success: false,
            message: "Access denied"
          }));
        case 8:
          res.status(200).json({
            success: true,
            data: candidate
          });
          _context3.next = 15;
          break;
        case 11:
          _context3.prev = 11;
          _context3.t0 = _context3["catch"](0);
          console.error("Get Candidate Error:", _context3.t0.message);
          res.status(500).json({
            success: false,
            message: "Failed to fetch candidate"
          });
        case 15:
        case "end":
          return _context3.stop();
      }
    }, _callee3, null, [[0, 11]]);
  }));
  return function (_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}();
exports.updateCandidate = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee4(req, res) {
    var _req$files4, _req$files5, _req$files6, updated;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          // ⭐ FILE UPLOADS
          if ((_req$files4 = req.files) !== null && _req$files4 !== void 0 && _req$files4.aadharFile) {
            req.body.aadharFile = "uploads/candidates/" + req.files.aadharFile[0].filename;
          }
          if ((_req$files5 = req.files) !== null && _req$files5 !== void 0 && _req$files5.dlFile) {
            req.body.dlFile = "uploads/candidates/" + req.files.dlFile[0].filename;
          }
          if ((_req$files6 = req.files) !== null && _req$files6 !== void 0 && _req$files6.otherFile) {
            req.body.otherFile = "uploads/candidates/" + req.files.otherFile[0].filename;
          }

          // ⭐ FIX: REMOVE INVALID BRANCH VALUES
          if (req.body.branch === "null" || req.body.branch === null || req.body.branch === "" || req.body.branch === undefined) {
            delete req.body.branch; // <-- THIS FIXES THE CAST ERROR
          }

          // ⭐ FIX: DO NOT REPLACE FILE WITH {}
          if ((0, _typeof2["default"])(req.body.aadharFile) === "object") delete req.body.aadharFile;
          if ((0, _typeof2["default"])(req.body.dlFile) === "object") delete req.body.dlFile;
          if ((0, _typeof2["default"])(req.body.otherFile) === "object") delete req.body.otherFile;
          _context4.next = 10;
          return Candidate.findByIdAndUpdate(req.params.id, req.body, {
            "new": true
          });
        case 10:
          updated = _context4.sent;
          if (updated) {
            _context4.next = 13;
            break;
          }
          return _context4.abrupt("return", res.status(404).json({
            success: false,
            message: "Candidate not found"
          }));
        case 13:
          res.status(200).json({
            success: true,
            message: "Candidate updated",
            data: updated
          });
          _context4.next = 20;
          break;
        case 16:
          _context4.prev = 16;
          _context4.t0 = _context4["catch"](0);
          console.error("Update Candidate Error:", _context4.t0.message);
          res.status(500).json({
            success: false,
            message: "Failed to update candidate"
          });
        case 20:
        case "end":
          return _context4.stop();
      }
    }, _callee4, null, [[0, 16]]);
  }));
  return function (_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}();

// Delete
exports.deleteCandidate = /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee5(req, res) {
    var removed;
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          _context5.next = 3;
          return Candidate.findByIdAndDelete(req.params.id);
        case 3:
          removed = _context5.sent;
          if (removed) {
            _context5.next = 6;
            break;
          }
          return _context5.abrupt("return", res.status(404).json({
            success: false,
            message: "Candidate not found"
          }));
        case 6:
          res.status(200).json({
            success: true,
            message: "Candidate deleted successfully"
          });
          _context5.next = 12;
          break;
        case 9:
          _context5.prev = 9;
          _context5.t0 = _context5["catch"](0);
          res.status(500).json({
            success: false,
            message: "Failed to delete candidate"
          });
        case 12:
        case "end":
          return _context5.stop();
      }
    }, _callee5, null, [[0, 9]]);
  }));
  return function (_x9, _x10) {
    return _ref5.apply(this, arguments);
  };
}();
exports.exportCandidates = /*#__PURE__*/function () {
  var _ref6 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee6(req, res) {
    var _req$query, fromDate, toDate, start, end, filter, candidates, workbook, sheet;
    return _regenerator["default"].wrap(function _callee6$(_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          _req$query = req.query, fromDate = _req$query.fromDate, toDate = _req$query.toDate;
          start = new Date(fromDate);
          end = new Date(toDate);
          end.setHours(23, 59, 59, 999);
          filter = {
            createdAt: {
              $gte: start,
              $lte: end
            }
          };
          _context6.next = 8;
          return Candidate.find(filter).lean();
        case 8:
          candidates = _context6.sent;
          if (candidates.length) {
            _context6.next = 11;
            break;
          }
          return _context6.abrupt("return", res.status(404).json({
            success: false,
            message: "No data found"
          }));
        case 11:
          workbook = new ExcelJS.Workbook();
          sheet = workbook.addWorksheet("Candidates List"); // ✅ DEFINE ALL COLUMNS (ONLY THESE WILL APPEAR)
          sheet.columns = [{
            header: "Name of Project",
            key: "project",
            width: 25
          }, {
            header: "Program Name",
            key: "program",
            width: 25
          }, {
            header: "Location",
            key: "location",
            width: 20
          }, {
            header: "Status",
            key: "status",
            width: 15
          }, {
            header: "Batch ID",
            key: "batchId",
            width: 15
          }, {
            header: "Candidate Name",
            key: "name",
            width: 25
          }, {
            header: "Father's Name",
            key: "fathersName",
            width: 25
          }, {
            header: "Mother's Name",
            key: "mothersName",
            width: 25
          }, {
            header: "Marital Status",
            key: "maritalStatus",
            width: 18
          }, {
            header: "Caste",
            key: "caste",
            width: 12
          }, {
            header: "Address",
            key: "address",
            width: 30
          }, {
            header: "Aadhar Number",
            key: "aadharNumber",
            width: 25
          }, {
            header: "Date of Birth",
            key: "dob",
            width: 18
          }, {
            header: "Gender",
            key: "gender",
            width: 12
          }, {
            header: "Religion",
            key: "religion",
            width: 18
          }, {
            header: "Vulnerability",
            key: "vulnerability",
            width: 20
          }, {
            header: "Annual Income",
            key: "annualIncome",
            width: 18
          }, {
            header: "Qualification",
            key: "qualification",
            width: 20
          }, {
            header: "Contact Number",
            key: "contactNumber",
            width: 20
          }, {
            header: "Assessment Date",
            key: "assessmentDate",
            width: 18
          }, {
            header: "DL Number",
            key: "dlNo",
            width: 22
          }, {
            header: "DL Type",
            key: "dlType",
            width: 20
          }, {
            header: "License Expiry Date",
            key: "licenseExpiryDate",
            width: 22
          }, {
            header: "DL Issue Date",
            key: "dlIssueDate",
            width: 18
          }, {
            header: "DL Authority",
            key: "dlAuthority",
            width: 22
          }, {
            header: "Experience (Years)",
            key: "experienceYears",
            width: 18
          }, {
            header: "Employer Name",
            key: "employerName",
            width: 25
          }, {
            header: "Employer Address",
            key: "employerAddress",
            width: 30
          }, {
            header: "Dependent Family Members",
            key: "dependentFamilyMembers",
            width: 22
          }, {
            header: "Owner / Driver",
            key: "ownerOrDriver",
            width: 18
          }, {
            header: "ABHA Number",
            key: "abha",
            width: 22
          }, {
            header: "Result",
            key: "result",
            width: 15
          }, {
            header: "Certificate Number",
            key: "certificateNo",
            width: 22
          }, {
            header: "Remarks",
            key: "remarks",
            width: 30
          }, {
            header: "eKYC Remarks",
            key: "ekycRemarks",
            width: 30
          }, {
            header: "eKYC Registered Email",
            key: "ekycRegisteredEmail",
            width: 30
          }, {
            header: "Bar Code",
            key: "barCode",
            width: 20
          }, {
            header: "Created Date",
            key: "createdAt",
            width: 22
          }];

          // ✅ ADD ROWS (NO `_id`, NO `branch`, NO SPREAD)
          candidates.forEach(function (c) {
            sheet.addRow({
              project: c.project,
              program: c.program,
              location: c.location,
              status: c.status,
              batchId: c.batchId,
              name: c.name,
              fathersName: c.fathersName,
              mothersName: c.mothersName,
              maritalStatus: c.maritalStatus,
              caste: c.caste,
              address: c.address,
              aadharNumber: c.aadharNumber,
              dob: c.dob,
              gender: c.gender,
              religion: c.religion === "Others" ? c.religionOther : c.religion,
              vulnerability: c.vulnerability,
              annualIncome: c.annualIncome,
              qualification: c.qualification,
              contactNumber: c.contactNumber,
              assessmentDate: c.assessmentDate,
              dlNo: c.dlNo,
              dlType: c.dlType,
              licenseExpiryDate: c.licenseExpiryDate,
              dlIssueDate: c.dlIssueDate,
              dlAuthority: c.dlAuthority,
              experienceYears: c.experienceYears,
              employerName: c.employerName,
              employerAddress: c.employerAddress,
              dependentFamilyMembers: c.dependentFamilyMembers,
              ownerOrDriver: c.ownerOrDriver,
              abha: c.abha,
              result: c.result,
              certificateNo: c.certificateNo,
              remarks: c.remarks,
              ekycRemarks: c.ekycRemarks,
              ekycRegisteredEmail: c.ekycRegisteredEmail,
              barCode: c.barCode,
              createdAt: new Date(c.createdAt).toLocaleDateString("en-IN")
            });
          });

          // ✅ STYLE
          sheet.getRow(1).font = {
            bold: true
          };
          sheet.views = [{
            state: "frozen",
            ySplit: 1
          }];
          res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
          res.setHeader("Content-Disposition", "attachment; filename=Candidates List.xlsx");
          _context6.next = 21;
          return workbook.xlsx.write(res);
        case 21:
          res.end();
          _context6.next = 28;
          break;
        case 24:
          _context6.prev = 24;
          _context6.t0 = _context6["catch"](0);
          console.error("Export Error:", _context6.t0);
          res.status(500).json({
            success: false,
            message: "Export failed"
          });
        case 28:
        case "end":
          return _context6.stop();
      }
    }, _callee6, null, [[0, 24]]);
  }));
  return function (_x11, _x12) {
    return _ref6.apply(this, arguments);
  };
}();