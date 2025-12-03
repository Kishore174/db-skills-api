"use strict";

var mongoose = require("mongoose");
var branchSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  // Branch Name
  location: {
    type: String,
    required: true
  },
  // Branch Location
  traineeName: {
    type: String,
    "default": ""
  },
  // Branch Incharge
  mobile: {
    type: String,
    "default": ""
  },
  email: {
    type: String,
    "default": ""
  }
}, {
  timestamps: true
});
module.exports = mongoose.model("Branch", branchSchema);