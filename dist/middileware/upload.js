"use strict";

var multer = require("multer");
var path = require("path");
var fs = require("fs");

// ⭐ Ensure folder exists
var uploadPath = path.join(__dirname, "../uploads/candidates");
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, {
    recursive: true
  });
}
var storage = multer.diskStorage({
  destination: function destination(req, file, cb) {
    cb(null, uploadPath); // Use dynamic path
  },
  filename: function filename(req, file, cb) {
    var unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  }
});
var upload = multer({
  storage: storage
});
module.exports = upload;