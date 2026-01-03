"use strict";

var express = require("express");
var path = require("path");
var fs = require("fs");
var router = express.Router();
router.get("/:filename", function (req, res) {
  try {
    var filePath = path.join(__dirname, "../../uploads", req.params.filename);
    if (!fs.existsSync(filePath)) {
      return res.status(404).send("File not found");
    }

    // ✅ OPEN PDF / IMAGE IN BROWSER
    res.setHeader("Content-Disposition", "inline");
    res.sendFile(filePath);
  } catch (error) {
    console.error(error);
    res.status(500).send("Unable to open file");
  }
});
module.exports = router;