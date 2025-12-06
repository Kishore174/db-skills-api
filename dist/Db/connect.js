"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var mongoose = require("mongoose");
var isConnected = false;
function connectDB() {
  return _connectDB.apply(this, arguments);
}
function _connectDB() {
  _connectDB = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee() {
    var db;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          if (!isConnected) {
            _context.next = 3;
            break;
          }
          console.log("🔁 Using existing MongoDB connection");
          return _context.abrupt("return");
        case 3:
          _context.prev = 3;
          mongoose.set("strictQuery", false);
          _context.next = 7;
          return mongoose.connect(process.env.MONGO_URI);
        case 7:
          db = _context.sent;
          isConnected = db.connections[0].readyState;
          console.log("🟢 MongoDB Connected Successfully");
          _context.next = 16;
          break;
        case 12:
          _context.prev = 12;
          _context.t0 = _context["catch"](3);
          console.error("🔴 MongoDB connection error:", _context.t0);
          process.exit(1); // stop server if db fails
        case 16:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[3, 12]]);
  }));
  return _connectDB.apply(this, arguments);
}
module.exports = connectDB;