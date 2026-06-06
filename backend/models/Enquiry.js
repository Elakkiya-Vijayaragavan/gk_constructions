const mongoose = require("mongoose");

const enquirySchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    phone: String,
    service: String,
    message: String,
    status: {
      type: String,
      enum: ["Pending", "In Review", "Approved", "Rejected", "Completed"],
      default: "Pending",
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Enquiry", enquirySchema);