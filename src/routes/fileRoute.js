const express = require("express");
const path = require("path");
const fs = require("fs");

const router = express.Router();

router.get("/:filename", (req, res) => {
  try {
    const filePath = path.join(
      __dirname,
      "../../uploads",
      req.params.filename
    );

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
