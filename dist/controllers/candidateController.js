"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var Candidate = require("../module/candidateModel");

// Create
exports.createCandidate = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee(req, res) {
    var candidate;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          candidate = new Candidate(req.body);
          _context.next = 4;
          return candidate.save();
        case 4:
          res.status(201).json({
            success: true,
            message: "Candidate created",
            candidate: candidate
          });
          _context.next = 11;
          break;
        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](0);
          console.error("Create Candidate Error:", _context.t0.message);
          res.status(500).json({
            success: false,
            message: "Failed to create candidate"
          });
        case 11:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[0, 7]]);
  }));
  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

// Get All
exports.getAllCandidates = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res) {
    var list;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return Candidate.find().sort({
            createdAt: -1
          });
        case 3:
          list = _context2.sent;
          res.status(200).json({
            success: true,
            data: list
          });
          _context2.next = 10;
          break;
        case 7:
          _context2.prev = 7;
          _context2.t0 = _context2["catch"](0);
          res.status(500).json({
            success: false,
            message: "Failed to fetch candidates"
          });
        case 10:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[0, 7]]);
  }));
  return function (_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();

// Get Single
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
          res.status(200).json({
            success: true,
            data: candidate
          });
          _context3.next = 12;
          break;
        case 9:
          _context3.prev = 9;
          _context3.t0 = _context3["catch"](0);
          res.status(500).json({
            success: false,
            message: "Failed to fetch candidate"
          });
        case 12:
        case "end":
          return _context3.stop();
      }
    }, _callee3, null, [[0, 9]]);
  }));
  return function (_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}();

// Update
exports.updateCandidate = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee4(req, res) {
    var updated;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _context4.next = 3;
          return Candidate.findByIdAndUpdate(req.params.id, req.body, {
            "new": true
          });
        case 3:
          updated = _context4.sent;
          if (updated) {
            _context4.next = 6;
            break;
          }
          return _context4.abrupt("return", res.status(404).json({
            success: false,
            message: "Candidate not found"
          }));
        case 6:
          res.status(200).json({
            success: true,
            message: "Candidate updated",
            data: updated
          });
          _context4.next = 13;
          break;
        case 9:
          _context4.prev = 9;
          _context4.t0 = _context4["catch"](0);
          console.error("Update Candidate Error:", _context4.t0.message);
          res.status(500).json({
            success: false,
            message: "Failed to update candidate"
          });
        case 13:
        case "end":
          return _context4.stop();
      }
    }, _callee4, null, [[0, 9]]);
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