"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var Branch = require("../module/branchModel");
var User = require("../module/userModel");
var bcrypt = require("bcryptjs");
var nodemailer = require("nodemailer");
var generatePassword = function generatePassword() {
  var length = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 10;
  var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$!";
  var password = "";
  for (var i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

/* ===============================
   CREATE BRANCH (CENTER)
=============================== */
exports.createBranch = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee(req, res) {
    var _req$body, name, location, traineeName, mobile, email, project, program, branch, username, plainPassword, hashedPassword, transporter, ADMIN_EMAIL;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _req$body = req.body, name = _req$body.name, location = _req$body.location, traineeName = _req$body.traineeName, mobile = _req$body.mobile, email = _req$body.email, project = _req$body.project, program = _req$body.program;
          if (!(!name || !location || !email)) {
            _context.next = 4;
            break;
          }
          return _context.abrupt("return", res.status(400).json({
            success: false,
            message: "Name, location and email are required"
          }));
        case 4:
          _context.next = 6;
          return Branch.create({
            name: name,
            location: location,
            traineeName: traineeName,
            mobile: mobile,
            email: email,
            project: project || "",
            program: program || ""
          });
        case 6:
          branch = _context.sent;
          // 🔐 AUTO-GENERATED PASSWORD
          username = email;
          plainPassword = generatePassword(10); // 🔥 auto password
          _context.next = 11;
          return bcrypt.hash(plainPassword, 10);
        case 11:
          hashedPassword = _context.sent;
          _context.next = 14;
          return User.create({
            username: username,
            password: hashedPassword,
            role: "branchUser",
            branch: branch._id
          });
        case 14:
          // 📧 SEND EMAIL
          transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASS
            }
          });
          ADMIN_EMAIL = "boopalan.dbsl@gmail.com";
          _context.next = 18;
          return transporter.sendMail({
            to: ADMIN_EMAIL,
            subject: "New Center Login Credentials",
            html: "\n    <h3>New Center Created</h3>\n    <p><strong>Center Name:</strong> ".concat(name, "</p>\n    <p><strong>Location:</strong> ").concat(location, "</p>\n    <p><strong>Username (Center Login):</strong> ").concat(username, "</p>\n    <p><strong>Password:</strong> ").concat(plainPassword, "</p>\n    <hr />\n    <p><strong>Project:</strong> ").concat(project || "-", "</p>\n    <p><strong>Program:</strong> ").concat(program || "-", "</p>\n  ")
          });
        case 18:
          res.status(201).json({
            success: true,
            message: "Branch created successfully & credentials sent to email",
            data: branch
          });
          _context.next = 25;
          break;
        case 21:
          _context.prev = 21;
          _context.t0 = _context["catch"](0);
          console.error("Branch Creation Error:", _context.t0.message);
          res.status(500).json({
            success: false,
            message: "Failed to create branch"
          });
        case 25:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[0, 21]]);
  }));
  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

/* ===============================
   GET ALL BRANCHES
=============================== */
exports.getAllBranches = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res) {
    var list;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return Branch.find().sort({
            createdAt: -1
          });
        case 3:
          list = _context2.sent;
          res.status(200).json({
            success: true,
            data: list
          });
          _context2.next = 11;
          break;
        case 7:
          _context2.prev = 7;
          _context2.t0 = _context2["catch"](0);
          console.error("Fetch Branch Error:", _context2.t0.message);
          res.status(500).json({
            success: false,
            message: "Failed to fetch branches"
          });
        case 11:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[0, 7]]);
  }));
  return function (_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();

/* ===============================
   GET SINGLE BRANCH
=============================== */
exports.getBranchById = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res) {
    var branch;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return Branch.findById(req.params.id);
        case 3:
          branch = _context3.sent;
          if (branch) {
            _context3.next = 6;
            break;
          }
          return _context3.abrupt("return", res.status(404).json({
            success: false,
            message: "Branch not found"
          }));
        case 6:
          res.status(200).json({
            success: true,
            data: branch
          });
          _context3.next = 13;
          break;
        case 9:
          _context3.prev = 9;
          _context3.t0 = _context3["catch"](0);
          console.error("Get Branch Error:", _context3.t0.message);
          res.status(500).json({
            success: false,
            message: "Failed to fetch branch"
          });
        case 13:
        case "end":
          return _context3.stop();
      }
    }, _callee3, null, [[0, 9]]);
  }));
  return function (_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}();

/* ===============================
   UPDATE BRANCH
=============================== */
exports.updateBranch = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee4(req, res) {
    var updated;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _context4.next = 3;
          return Branch.findByIdAndUpdate(req.params.id, req.body,
          // includes project & program
          {
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
            message: "Branch not found"
          }));
        case 6:
          res.status(200).json({
            success: true,
            message: "Branch updated successfully",
            data: updated
          });
          _context4.next = 13;
          break;
        case 9:
          _context4.prev = 9;
          _context4.t0 = _context4["catch"](0);
          console.error("Update Branch Error:", _context4.t0.message);
          res.status(500).json({
            success: false,
            message: "Failed to update branch"
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

/* ===============================
   DELETE BRANCH
=============================== */
exports.deleteBranch = /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee5(req, res) {
    var removed;
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          _context5.next = 3;
          return Branch.findByIdAndDelete(req.params.id);
        case 3:
          removed = _context5.sent;
          if (removed) {
            _context5.next = 6;
            break;
          }
          return _context5.abrupt("return", res.status(404).json({
            success: false,
            message: "Branch not found"
          }));
        case 6:
          _context5.next = 8;
          return User.deleteOne({
            branch: req.params.id
          });
        case 8:
          res.status(200).json({
            success: true,
            message: "Branch & branch user deleted successfully"
          });
          _context5.next = 15;
          break;
        case 11:
          _context5.prev = 11;
          _context5.t0 = _context5["catch"](0);
          console.error("Delete Branch Error:", _context5.t0.message);
          res.status(500).json({
            success: false,
            message: "Failed to delete branch"
          });
        case 15:
        case "end":
          return _context5.stop();
      }
    }, _callee5, null, [[0, 11]]);
  }));
  return function (_x9, _x10) {
    return _ref5.apply(this, arguments);
  };
}();
exports.getMyBranch = /*#__PURE__*/function () {
  var _ref6 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee6(req, res) {
    var branch;
    return _regenerator["default"].wrap(function _callee6$(_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          _context6.next = 3;
          return Branch.findById(req.user.branch);
        case 3:
          branch = _context6.sent;
          if (branch) {
            _context6.next = 6;
            break;
          }
          return _context6.abrupt("return", res.status(404).json({
            success: false,
            message: "Branch not found"
          }));
        case 6:
          res.status(200).json({
            success: true,
            data: branch
          });
          _context6.next = 12;
          break;
        case 9:
          _context6.prev = 9;
          _context6.t0 = _context6["catch"](0);
          res.status(500).json({
            success: false,
            message: "Failed"
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