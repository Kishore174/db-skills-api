"use strict";

var multer = require("multer");
var path = require("path");
var fs = require("fs");
var uploadDir = path.resolve("uploads/candidates");

// ✅ Ensure folder exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, {
    recursive: true
  });
}
var storage = multer.diskStorage({
  destination: function destination(req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function filename(req, file, cb) {
    var uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9) + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});
module.exports = multer({
  storage: storage
});