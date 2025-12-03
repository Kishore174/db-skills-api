"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
// src/controllers/authController.js
var User = require('../module/userModel');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
exports.register = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee(req, res) {
    var _req$body, username, password, role, existingUser, hashedPassword, newUser;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          console.log("BODY RECEIVED:", req.body); // Debug
          _req$body = req.body, username = _req$body.username, password = _req$body.password, role = _req$body.role;
          _context.next = 5;
          return User.findOne({
            username: username
          });
        case 5:
          existingUser = _context.sent;
          if (!existingUser) {
            _context.next = 8;
            break;
          }
          return _context.abrupt("return", res.status(400).json({
            success: false,
            message: 'User  already exists'
          }));
        case 8:
          _context.next = 10;
          return bcrypt.hash(password, 10);
        case 10:
          hashedPassword = _context.sent;
          newUser = new User({
            username: username,
            password: hashedPassword,
            role: role
          });
          _context.next = 14;
          return newUser.save();
        case 14:
          res.status(201).json({
            success: true,
            message: 'User  registered successfully'
          });
          _context.next = 21;
          break;
        case 17:
          _context.prev = 17;
          _context.t0 = _context["catch"](0);
          console.error('Registration error:', _context.t0.message);
          res.status(500).json({
            success: false,
            message: 'Registration failed'
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
exports.login = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res) {
    var _req$body2, username, password, user, isMatch, token;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _req$body2 = req.body, username = _req$body2.username, password = _req$body2.password;
          _context2.next = 4;
          return User.findOne({
            username: username
          });
        case 4:
          user = _context2.sent;
          if (user) {
            _context2.next = 7;
            break;
          }
          return _context2.abrupt("return", res.status(400).json({
            success: false,
            message: 'Invalid credentials'
          }));
        case 7:
          _context2.next = 9;
          return bcrypt.compare(password, user.password);
        case 9:
          isMatch = _context2.sent;
          if (isMatch) {
            _context2.next = 12;
            break;
          }
          return _context2.abrupt("return", res.status(400).json({
            success: false,
            message: 'Invalid credentials'
          }));
        case 12:
          // ⭐ FIX: include branch inside JWT
          token = jwt.sign({
            id: user._id,
            role: user.role,
            branch: user.branch // <<<<<<⭐ IMPORTANT
          }, process.env.JWT_SECRET, {
            expiresIn: '1h'
          });
          res.status(200).json({
            success: true,
            token: token,
            role: user.role,
            branch: user.branch
          });
          _context2.next = 20;
          break;
        case 16:
          _context2.prev = 16;
          _context2.t0 = _context2["catch"](0);
          console.error('Login error:', _context2.t0.message);
          res.status(500).json({
            success: false,
            message: 'Login failed'
          });
        case 20:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[0, 16]]);
  }));
  return function (_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();