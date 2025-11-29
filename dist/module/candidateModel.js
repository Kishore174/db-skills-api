"use strict";

var mongoose = require("mongoose");
var candidateSchema = new mongoose.Schema({
  project: {
    type: String,
    "default": ""
  },
  // Project
  location: {
    type: String,
    "default": ""
  },
  // Location
  status: {
    type: String,
    "default": ""
  },
  // Status
  batchId: {
    type: String,
    "default": ""
  },
  // Batch Id

  name: {
    type: String,
    "default": ""
  },
  // Candidate Name
  aadharNumber: {
    type: String,
    "default": ""
  },
  // Aadhar No
  dob: {
    type: String,
    "default": ""
  },
  // DOB
  gender: {
    type: String,
    "default": ""
  },
  // Gender
  religion: {
    type: String,
    "default": ""
  },
  // Religion
  vulnerability: {
    type: String,
    "default": ""
  },
  // Vulnerability
  annualIncome: {
    type: Number,
    "default": 0
  },
  // Annual Income
  qualification: {
    type: String,
    "default": ""
  },
  // Educational Qualification

  contactNumber: {
    type: String,
    "default": ""
  },
  // Contact No of Trainee

  assessmentDate: {
    type: String,
    "default": ""
  },
  // Assessment Date

  dlNo: {
    type: String,
    "default": ""
  },
  // DL No
  dlType: {
    type: String,
    "default": ""
  },
  // Licence Type
  licenseExpiryDate: {
    type: String,
    "default": ""
  },
  // Licence Expiry Date

  dependentFamilyMembers: {
    type: Number,
    "default": 0
  },
  // No of Dependent Family Members
  ownerOrDriver: {
    type: String,
    "default": ""
  },
  // Owner/Driver Status

  abha: {
    type: String,
    "default": ""
  },
  // ABHA Number

  result: {
    type: String,
    "default": ""
  },
  // Result
  certificateNo: {
    type: String,
    "default": ""
  },
  // Certificate No
  remarks: {
    type: String,
    "default": ""
  },
  // Remarks

  ekycRemarks: {
    type: String,
    "default": ""
  },
  // eKYC Remarks
  ekycRegisteredEmail: {
    type: String,
    "default": ""
  },
  // eKYC Registered Email ID

  barCode: {
    type: String,
    "default": ""
  } // Bar Code
}, {
  timestamps: true
});
module.exports = mongoose.model("Candidate", candidateSchema);