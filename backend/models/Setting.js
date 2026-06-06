const mongoose = require("mongoose");

const settingSchema = new mongoose.Schema(
  {
    companyName: { type: String, default: "GK Constructions" },
    phone: { type: String, default: "+91 98765 43210" },
    email: { type: String, default: "kavihari155@gmail.com" },
    address: { type: String, default: "KG Valasu, Erode" },
    ownerName: { type: String, default: "L. Kaviyarasu" },
    engineerDetails: { type: String, default: "B.E. Civil Engineer" },
    qualification: { type: String, default: "B.E. Civil Engineer" },
    experience: { type: String, default: "Construction planning, design, and site supervision" },
    skills: { type: [String], default: ["Residential Construction", "Commercial Construction", "2D Planning", "3D Elevation", "Site Supervision"] },
    profilePhoto: { type: String, default: "" },
    about: { type: String, default: "Professional construction, design and engineering solutions." },
    whatsapp: { type: String, default: "+91 98765 43210" },
    socialLinks: {
      facebook: String,
      instagram: String,
      linkedin: String,
      whatsapp: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Setting", settingSchema);
