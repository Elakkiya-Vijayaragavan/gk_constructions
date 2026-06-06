const path = require("path");
const fs = require("fs");

const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded." });
    }

    const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    return res.status(201).json({ url: fileUrl, file: req.file });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { uploadFile };
