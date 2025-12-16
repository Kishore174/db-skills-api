"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var Project = require("../module/projectModel");

/**
 * CREATE PROJECT
 */
exports.createProject = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee(req, res) {
    var _req$body, projectName, programName, newProject;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _req$body = req.body, projectName = _req$body.projectName, programName = _req$body.programName;
          if (!(!projectName || !programName)) {
            _context.next = 4;
            break;
          }
          return _context.abrupt("return", res.status(400).json({
            success: false,
            message: "Project name and program name are required"
          }));
        case 4:
          newProject = new Project({
            projectName: projectName,
            programName: programName,
            createdBy: req.user.id,
            branch: req.user.branch || null
          });
          _context.next = 7;
          return newProject.save();
        case 7:
          res.status(201).json({
            success: true,
            message: "Project created successfully",
            data: newProject
          });
          _context.next = 14;
          break;
        case 10:
          _context.prev = 10;
          _context.t0 = _context["catch"](0);
          console.error("Create project error:", _context.t0.message);
          res.status(500).json({
            success: false,
            message: "Failed to create project"
          });
        case 14:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[0, 10]]);
  }));
  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

/**
 * PROJECT STATS (COUNT)
 */
exports.getProjectStats = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res) {
    var uniqueProjects, uniquePrograms;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return Project.distinct("projectName");
        case 3:
          uniqueProjects = _context2.sent;
          _context2.next = 6;
          return Project.distinct("programName");
        case 6:
          uniquePrograms = _context2.sent;
          res.status(200).json({
            success: true,
            data: {
              totalProjects: uniqueProjects.length,
              totalPrograms: uniquePrograms.length
            }
          });
          _context2.next = 14;
          break;
        case 10:
          _context2.prev = 10;
          _context2.t0 = _context2["catch"](0);
          console.error("Project stats error:", _context2.t0.message);
          res.status(500).json({
            success: false,
            message: "Failed to fetch project stats"
          });
        case 14:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[0, 10]]);
  }));
  return function (_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();

/**
 * GET ALL PROJECT NAMES
 */
exports.getAllProjects = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res) {
    var projects;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return Project.find({}, {
            projectName: 1,
            _id: 0
          });
        case 3:
          projects = _context3.sent;
          res.status(200).json({
            success: true,
            data: projects
          });
          _context3.next = 10;
          break;
        case 7:
          _context3.prev = 7;
          _context3.t0 = _context3["catch"](0);
          res.status(500).json({
            success: false,
            message: "Failed to fetch projects"
          });
        case 10:
        case "end":
          return _context3.stop();
      }
    }, _callee3, null, [[0, 7]]);
  }));
  return function (_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}();
/**
 * GET PROGRAMS BY PROJECT NAME
 */
exports.getProgramsByProject = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee4(req, res) {
    var projectName, programs;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          projectName = req.params.projectName;
          _context4.next = 4;
          return Project.distinct("programName", {
            projectName: projectName
          });
        case 4:
          programs = _context4.sent;
          res.status(200).json({
            success: true,
            data: programs
          });
          _context4.next = 11;
          break;
        case 8:
          _context4.prev = 8;
          _context4.t0 = _context4["catch"](0);
          res.status(500).json({
            success: false,
            message: "Failed"
          });
        case 11:
        case "end":
          return _context4.stop();
      }
    }, _callee4, null, [[0, 8]]);
  }));
  return function (_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}();
exports.getAllProgramsByProject = /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee5(req, res) {
    var projects, result;
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          _context5.next = 3;
          return Project.find({}, {
            projectName: 1,
            programName: 1,
            _id: 0
          });
        case 3:
          projects = _context5.sent;
          result = {};
          projects.forEach(function (p) {
            if (!result[p.projectName]) {
              result[p.projectName] = new Set();
            }
            result[p.projectName].add(p.programName);
          });
          Object.keys(result).forEach(function (key) {
            result[key] = Array.from(result[key]);
          });
          res.status(200).json({
            success: true,
            data: result
          });
          _context5.next = 13;
          break;
        case 10:
          _context5.prev = 10;
          _context5.t0 = _context5["catch"](0);
          res.status(500).json({
            success: false
          });
        case 13:
        case "end":
          return _context5.stop();
      }
    }, _callee5, null, [[0, 10]]);
  }));
  return function (_x9, _x10) {
    return _ref5.apply(this, arguments);
  };
}();
exports.getBranchProjects = /*#__PURE__*/function () {
  var _ref6 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee6(req, res) {
    var filter, projects;
    return _regenerator["default"].wrap(function _callee6$(_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          filter = {}; // Branch user → only their branch
          if (req.user.role === "branchUser") {
            filter.branch = req.user.branch;
          }
          _context6.next = 5;
          return Project.distinct("projectName", filter);
        case 5:
          projects = _context6.sent;
          res.status(200).json({
            success: true,
            data: projects
          });
          _context6.next = 12;
          break;
        case 9:
          _context6.prev = 9;
          _context6.t0 = _context6["catch"](0);
          res.status(500).json({
            success: false,
            message: "Failed to fetch projects"
          });
        case 12:
        case "end":
          return _context6.stop();
      }
    }, _callee6, null, [[0, 9]]);
  }));
  return function (_x11, _x12) {
    return _ref6.apply(this, arguments);
  };
}();