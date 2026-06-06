const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    url: { type: String, required: true },
    project: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Document", documentSchema);
