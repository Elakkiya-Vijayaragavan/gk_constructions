const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    location: String,
    category: String,
    status: { type: String, default: "Ongoing" },
    image: String,
    coverImage: String,
    images: [String],
    gallery: [String],
    documents: [{ name: String, url: String }],
    client: String,
    startDate: Date,
    completionDate: Date,
    area: String,
    budget: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Project", projectSchema);
