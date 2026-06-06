const mongoose = require("mongoose");

const gallerySchema = new mongoose.Schema(
  {
    title: String,
    url: { type: String, required: true },
    project: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Gallery", gallerySchema);
