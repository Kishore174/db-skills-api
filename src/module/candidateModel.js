const mongoose = require("mongoose");

const candidateSchema = new mongoose.Schema(
  {
    project: { type: String, default: "" },
    location: { type: String, default: "" },
    status: { type: String, default: "" },
    batchId: { type: String, default: "" },

    name: { type: String, default: "" },
    fathersName: { type: String, default: "" },
    mothersName: { type: String, default: "" },
    maritalStatus: { type: String, default: "" },
    caste: { type: String, default: "" },
    address: { type: String, default: "" },

    aadharNumber: { type: String, default: "" },
    dob: { type: String, default: "" },
    gender: { type: String, default: "" },
    religion: { type: String, default: "" },
    vulnerability: { type: String, default: "" },
    annualIncome: { type: Number, default: 0 },
    qualification: { type: String, default: "" },

    contactNumber: { type: String, default: "" },
    assessmentDate: { type: String, default: "" },

    dlNo: { type: String, default: "" },
    dlType: { type: String, default: "" },
    licenseExpiryDate: { type: String, default: "" },

    // ⭐ NEW FIELDS ADDED FROM YOUR React form
    dlIssueDate: { type: String, default: "" },
    dlAuthority: { type: String, default: "" },
    experienceYears: { type: String, default: "" },
    employerName: { type: String, default: "" },
    employerAddress: { type: String, default: "" },

    dependentFamilyMembers: { type: Number, default: 0 },
    ownerOrDriver: { type: String, default: "" },

    abha: { type: String, default: "" },

    result: { type: String, default: "" },
    certificateNo: { type: String, default: "" },
    remarks: { type: String, default: "" },

    ekycRemarks: { type: String, default: "" },
    ekycRegisteredEmail: { type: String, default: "" },

    barCode: { type: String, default: "" },
     
    aadharFile: { type: String, default: "" },
dlFile: { type: String, default: "" },
otherFile: { type: String, default: "" },
program: { type: String, default: "" },

    // ⭐ NEW: Branch (Role-based)
    branch: { type: mongoose.Schema.Types.ObjectId, ref: "Branch", default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Candidate", candidateSchema);
