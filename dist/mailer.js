"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var nodemailer = require('nodemailer');
var fs = require('fs');
var path = require('path');

// Load environment variables
require('dotenv').config();
var transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});
var sendInquiryEmail = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee(to, studentData) {
    var templatePath, template, mailOptionsToParent, mailOptionsToAdmin;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          // Read the HTML template
          templatePath = path.join(__dirname, "Templetes/inquiryNotification.html");
          template = fs.readFileSync(templatePath, 'utf8'); // Replace placeholders with actual data
          template = template.replace('{{studentName}}', studentData.studentName).replace('{{fatherName}}', studentData.fatherName).replace('{{fatherMobile}}', studentData.fatherMobile);

          // Mail options for the parent
          mailOptionsToParent = {
            from: process.env.EMAIL_USER,
            // Use the environment variable for the sender's email
            to: to,
            // Father's email
            subject: 'New Student Enquiry Notification',
            html: template
          }; // Send email to the parent
          _context.next = 7;
          return transporter.sendMail(mailOptionsToParent);
        case 7:
          console.log("\uD83D\uDCE7 Enquiry email sent to: ".concat(to));

          // Mail options for yourself (admin)
          mailOptionsToAdmin = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            subject: '📩 New Inquiry Received',
            html: "\n        <h1>New Enquiry from ".concat(studentData.studentName, "</h1>\n        <p>You have received a new inquiry:</p>\n        <ul>\n          <li><strong>Student Name:</strong> ").concat(studentData.studentName, "</li>\n          <li><strong>Father's Name:</strong> ").concat(studentData.fatherName, "</li>\n          <li><strong>Mobile Number:</strong> ").concat(studentData.fatherMobile, "</li>\n        </ul>\n        <p>\n          <a href=\"https://kalamkids.in/login\" target=\"_blank\" style=\"display:inline-block;margin-top:10px;padding:8px 15px;background-color:#114497;color:#fff;text-decoration:none;border-radius:5px;\">\n            Click Here to Login\n          </a>\n        </p>\n      ")
          }; // Send email to yourself (admin)
          _context.next = 11;
          return transporter.sendMail(mailOptionsToAdmin);
        case 11:
          console.log("\uD83D\uDCE7 Inquiry notification sent to admin: ".concat(process.env.EMAIL_USER));
          _context.next = 17;
          break;
        case 14:
          _context.prev = 14;
          _context.t0 = _context["catch"](0);
          console.error("❌ Error sending inquiry email:", _context.t0);
        case 17:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[0, 14]]);
  }));
  return function sendInquiryEmail(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();
var sendAdmissionApprovalEmail = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee2(to, studentData) {
    var templatePath, template, mailOptions;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          // Read the HTML template
          templatePath = path.join(__dirname, "Templetes/admissionApprovalNotification.html");
          template = fs.readFileSync(templatePath, 'utf8'); // Replace placeholders with actual data
          template = template.replace('{{studentName}}', studentData.studentName).replace('{{admissionNumber}}', studentData.admissionNumber).replace('{{parentType}}', studentData.parentType);

          // Mail options for the parent
          mailOptions = {
            from: process.env.EMAIL_USER,
            // Use the environment variable for the sender's email
            to: to,
            // Parent's email
            subject: 'Admission Approval Notification',
            html: template
          }; // Send email to the parent
          _context2.next = 7;
          return transporter.sendMail(mailOptions);
        case 7:
          console.log("\uD83D\uDCE7 Admission approval email sent to: ".concat(to));
          _context2.next = 13;
          break;
        case 10:
          _context2.prev = 10;
          _context2.t0 = _context2["catch"](0);
          console.error("❌ Error sending admission approval email:", _context2.t0);
        case 13:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[0, 10]]);
  }));
  return function sendAdmissionApprovalEmail(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();
module.exports = {
  sendInquiryEmail: sendInquiryEmail,
  sendAdmissionApprovalEmail: sendAdmissionApprovalEmail
};