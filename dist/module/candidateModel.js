"use strict";

var mongoose = require("mongoose");
var candidateSchema = new mongoose.Schema({
  project: {
    type: String,
    "default": ""
  },
  location: {
    type: String,
    "default": ""
  },
  status: {
    type: String,
    "default": ""
  },
  batchId: {
    type: String,
    "default": ""
  },
  name: {
    type: String,
    "default": ""
  },
  aadharNumber: {
    type: String,
    "default": ""
  },
  dob: {
    type: String,
    "default": ""
  },
  gender: {
    type: String,
    "default": ""
  },
  religion: {
    type: String,
    "default": ""
  },
  vulnerability: {
    type: String,
    "default": ""
  },
  annualIncome: {
    type: Number,
    "default": 0
  },
  qualification: {
    type: String,
    "default": ""
  },
  contactNumber: {
    type: String,
    "default": ""
  },
  assessmentDate: {
    type: String,
    "default": ""
  },
  dlNo: {
    type: String,
    "default": ""
  },
  dlType: {
    type: String,
    "default": ""
  },
  licenseExpiryDate: {
    type: String,
    "default": ""
  },
  dependentFamilyMembers: {
    type: Number,
    "default": 0
  },
  ownerOrDriver: {
    type: String,
    "default": ""
  },
  abha: {
    type: String,
    "default": ""
  },
  result: {
    type: String,
    "default": ""
  },
  certificateNo: {
    type: String,
    "default": ""
  },
  remarks: {
    type: String,
    "default": ""
  },
  ekycRemarks: {
    type: String,
    "default": ""
  },
  ekycRegisteredEmail: {
    type: String,
    "default": ""
  },
  barCode: {
    type: String,
    "default": ""
  },
  // ⭐ NEW: Branch added for role-based authentication & filtering
  branch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Branch",
    required: false
  }
}, {
  timestamps: true
});
module.exports = mongoose.model("Candidate", candidateSchema);