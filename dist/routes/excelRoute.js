"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
function _asyncIterator(r) { var n, t, o, e = 2; for ("undefined" != typeof Symbol && (t = Symbol.asyncIterator, o = Symbol.iterator); e--;) { if (t && null != (n = r[t])) return n.call(r); if (o && null != (n = r[o])) return new AsyncFromSyncIterator(n.call(r)); t = "@@asyncIterator", o = "@@iterator"; } throw new TypeError("Object is not async iterable"); }
function AsyncFromSyncIterator(r) { function AsyncFromSyncIteratorContinuation(r) { if (Object(r) !== r) return Promise.reject(new TypeError(r + " is not an object.")); var n = r.done; return Promise.resolve(r.value).then(function (r) { return { value: r, done: n }; }); } return AsyncFromSyncIterator = function AsyncFromSyncIterator(r) { this.s = r, this.n = r.next; }, AsyncFromSyncIterator.prototype = { s: null, n: null, next: function next() { return AsyncFromSyncIteratorContinuation(this.n.apply(this.s, arguments)); }, "return": function _return(r) { var n = this.s["return"]; return void 0 === n ? Promise.resolve({ value: r, done: !0 }) : AsyncFromSyncIteratorContinuation(n.apply(this.s, arguments)); }, "throw": function _throw(r) { var n = this.s["return"]; return void 0 === n ? Promise.reject(r) : AsyncFromSyncIteratorContinuation(n.apply(this.s, arguments)); } }, new AsyncFromSyncIterator(r); }
var express = require("express");
var router = express.Router();
var multer = require("multer");
var fs = require("fs");
var csv = require("csv-parser");
var Candidate = require("../module/candidateModel");
var upload = multer({
  dest: "uploads/"
});

// 🔹 Normalize project names
var projectMap = {
  "Linde Hazmat": "Linde",
  "Linde Upskilling": "Linde",
  "SSSF Upskilling": "Shriram Finance"
};

// 🔹 Project → Program mapping
var programMap = {
  "Linde Hazmat": "Hazardous (Hydrogen Tanker) Training Program",
  "SSSF Upskilling": "One Day Refresher Program",
  "Linde Upskilling": "One Day Refresher Program"
};
router.post("/upload-csv", upload.single("file"), /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee(req, res) {
    var BATCH_SIZE, batch, inserted, skipped, totalRows, stream, _iteratorAbruptCompletion, _didIteratorError, _iteratorError, _iterator, _step, row, _row$Project, rawProject, project, program, aadharNumber;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          BATCH_SIZE = 2000;
          batch = [];
          inserted = 0;
          skipped = 0;
          totalRows = 0;
          stream = fs.createReadStream(req.file.path).pipe(csv());
          _iteratorAbruptCompletion = false;
          _didIteratorError = false;
          _context.prev = 8;
          _iterator = _asyncIterator(stream);
        case 10:
          _context.next = 12;
          return _iterator.next();
        case 12:
          if (!(_iteratorAbruptCompletion = !(_step = _context.sent).done)) {
            _context.next = 32;
            break;
          }
          row = _step.value;
          totalRows++;
          rawProject = ((_row$Project = row.Project) === null || _row$Project === void 0 ? void 0 : _row$Project.trim()) || ""; // ✅ Normalize project
          project = projectMap[rawProject] || rawProject; // ✅ Assign program based on original project
          program = programMap[rawProject] || "";
          aadharNumber = row.Aadharno ? row.Aadharno.toString().replace(/\D/g, "") : "";
          if (!(aadharNumber.length !== 12)) {
            _context.next = 22;
            break;
          }
          skipped++;
          return _context.abrupt("continue", 29);
        case 22:
          batch.push({
            project: project,
            program: program,
            aadharNumber: aadharNumber,
            approvalstatus: "Approved",
            approvalReason: "Auto approved via bulk upload"
          });
          if (!(batch.length === BATCH_SIZE)) {
            _context.next = 29;
            break;
          }
          _context.t0 = inserted;
          _context.next = 27;
          return insertBatch(batch);
        case 27:
          inserted = _context.t0 += _context.sent;
          batch = [];
        case 29:
          _iteratorAbruptCompletion = false;
          _context.next = 10;
          break;
        case 32:
          _context.next = 38;
          break;
        case 34:
          _context.prev = 34;
          _context.t1 = _context["catch"](8);
          _didIteratorError = true;
          _iteratorError = _context.t1;
        case 38:
          _context.prev = 38;
          _context.prev = 39;
          if (!(_iteratorAbruptCompletion && _iterator["return"] != null)) {
            _context.next = 43;
            break;
          }
          _context.next = 43;
          return _iterator["return"]();
        case 43:
          _context.prev = 43;
          if (!_didIteratorError) {
            _context.next = 46;
            break;
          }
          throw _iteratorError;
        case 46:
          return _context.finish(43);
        case 47:
          return _context.finish(38);
        case 48:
          if (!batch.length) {
            _context.next = 53;
            break;
          }
          _context.t2 = inserted;
          _context.next = 52;
          return insertBatch(batch);
        case 52:
          inserted = _context.t2 += _context.sent;
        case 53:
          fs.unlinkSync(req.file.path); // cleanup

          res.json({
            success: true,
            message: "CSV uploaded successfully",
            totalRows: totalRows,
            inserted: inserted,
            skipped: skipped
          });
        case 55:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[8, 34, 38, 48], [39,, 43, 47]]);
  }));
  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}());
function insertBatch(_x3) {
  return _insertBatch.apply(this, arguments);
}
function _insertBatch() {
  _insertBatch = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee2(rows) {
    var _err$insertedDocs;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return Candidate.insertMany(rows, {
            ordered: false
          });
        case 3:
          return _context2.abrupt("return", rows.length);
        case 6:
          _context2.prev = 6;
          _context2.t0 = _context2["catch"](0);
          return _context2.abrupt("return", ((_err$insertedDocs = _context2.t0.insertedDocs) === null || _err$insertedDocs === void 0 ? void 0 : _err$insertedDocs.length) || 0);
        case 9:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[0, 6]]);
  }));
  return _insertBatch.apply(this, arguments);
}
module.exports = router;