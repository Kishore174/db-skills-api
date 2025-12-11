const multer = require("multer");
const path = require("path");
const fs = require("fs");

// ⭐ Ensure folder exists
const uploadPath = path.join(__dirname, "../uploads/candidates");

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath); // Use dynamic path
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

module.exports = upload;
