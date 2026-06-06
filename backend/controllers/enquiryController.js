const Enquiry = require("../models/Enquiry");

const getEnquiries = async (req, res) => {
  try {
    const enquiries = await Enquiry.find().sort({ createdAt: -1 });
    res.json({ enquiries });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createEnquiry = async (req, res) => {
  try {
    const enquiry = await Enquiry.create(req.body);
    res.status(201).json({ enquiry });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateEnquiry = async (req, res) => {
  try {
    const enquiry = await Enquiry.findById(req.params.id);
    if (!enquiry) {
      return res.status(404).json({ message: "Enquiry not found." });
    }
    Object.assign(enquiry, req.body);
    await enquiry.save();
    res.json({ enquiry });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getEnquiries, createEnquiry, updateEnquiry };
