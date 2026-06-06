const mongoose = require("mongoose");

const serviceRequestSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    service: { type: String, required: true },
    location: String,
    budget: String,
    preferredDate: String,
    requirements: String,
    status: {
      type: String,
      enum: ["New Request", "Under Review", "Contacted", "Accepted", "Rejected", "Completed"],
      default: "New Request",
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ServiceRequest", serviceRequestSchema);
