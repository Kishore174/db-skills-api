const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "branchUser"], default: "branchUser" },

  branch: { type: mongoose.Schema.Types.ObjectId, ref: "Branch", default: null }
});

module.exports = mongoose.model("User", userSchema);
