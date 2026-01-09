"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var express = require("express");
var router = express.Router();
var Candidate = require("../module/candidateModel");
var _require = require("../controllers/candidateController"),
  createCandidate = _require.createCandidate,
  getAllCandidates = _require.getAllCandidates,
  getCandidateById = _require.getCandidateById,
  updateCandidate = _require.updateCandidate,
  deleteCandidate = _require.deleteCandidate,
  exportCandidates = _require.exportCandidates,
  approveCandidate = _require.approveCandidate;
var auth = require("../middileware/authMiddleware");
var upload = require("../middileware/upload");

// ⭐ File fields accepted
var fileUpload = upload.fields([{
  name: "aadharFile",
  maxCount: 1
}, {
  name: "dlFile",
  maxCount: 1
}, {
  name: "otherFile",
  maxCount: 1
}]);

// ⭐ CREATE (branchUser + admin)
router.post("/create", auth(["branchUser", "admin"]), fileUpload, createCandidate);

// ⭐ APPROVE (ADMIN ONLY)
router.put("/approve/:id", auth(["admin"]), approveCandidate);
router.get("/check-aadhar/:aadhar", auth(["admin", "branchUser"]), /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee(req, res) {
    var candidate;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return Candidate.findOne({
            aadharNumber: req.params.aadhar
          });
        case 3:
          candidate = _context.sent;
          if (!candidate) {
            _context.next = 6;
            break;
          }
          return _context.abrupt("return", res.json({
            exists: true,
            candidate: candidate
          }));
        case 6:
          res.json({
            exists: false
          });
          _context.next = 13;
          break;
        case 9:
          _context.prev = 9;
          _context.t0 = _context["catch"](0);
          console.error("Check Aadhaar Error:", _context.t0);
          res.status(500).json({
            message: "Aadhaar check failed"
          });
        case 13:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[0, 9]]);
  }));
  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}());

// ⭐ EXPORT
router.get("/export", auth(["admin", "branchUser"]), exportCandidates);

// ⭐ GET ALL
router.get("/all", auth(["admin", "branchUser"]), getAllCandidates);
router.get("/:id", auth(["admin", "branchUser"]), getCandidateById);
router.put("/:id", auth(["admin", "branchUser"]), fileUpload, updateCandidate);
router["delete"]("/:id", auth(["admin"]), deleteCandidate);
module.exports = router;