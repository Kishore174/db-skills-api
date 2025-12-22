"use strict";

var mongoose = require("mongoose");
var branchSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  traineeName: {
    type: String,
    "default": ""
  },
  mobile: {
    type: String,
    "default": ""
  },
  email: {
    type: String,
    "default": ""
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  project: {
    type: String,
    "default": ""
  },
  program: {
    type: String,
    "default": ""
  }
}, {
  timestamps: true
});
module.exports = mongoose.model("Branch", branchSchema);