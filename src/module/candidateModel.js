const mongoose = require("mongoose");

const candidateSchema = new mongoose.Schema({
  srNo: Number,
  location: String,
  name: String,
  aadharNumber: { type: String, unique: false }, 
  dob: String,
  gender: String,
  religion: String,
  vulnerability: String,
  annualIncome: Number,
  qualification: String,
  contactNumber: String,
  assessmentDate: String,
  dlNo: String,
  dlType: String,
  licenseExpiryDate: String,
  dependentFamilyMembers: Number,
  ownerOrDriver: String,
  abha: String,
  jobRole: String,
  jobCode: String,
  email: String,
  youtube: String,
  facebook: String,
  instagram: String,
  ekycRemarks: String
}, { timestamps: true });

module.exports = mongoose.model("Candidate", candidateSchema);
