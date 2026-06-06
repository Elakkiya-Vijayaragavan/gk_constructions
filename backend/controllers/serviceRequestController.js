const ServiceRequest = require("../models/ServiceRequest");

const getServiceRequests = async (req, res) => {
  try {
    const requests = await ServiceRequest.find().sort({ createdAt: -1 });
    res.json({ requests });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserServiceRequests = async (req, res) => {
  try {
    const requests = await ServiceRequest.find({ email: req.user.email }).sort({ createdAt: -1 });
    res.json({ requests });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createServiceRequest = async (req, res) => {
  try {
    const request = await ServiceRequest.create(req.body);
    res.status(201).json({ request });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateServiceRequest = async (req, res) => {
  try {
    const request = await ServiceRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: "Service request not found." });
    }
    Object.assign(request, req.body);
    await request.save();
    res.json({ request });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteServiceRequest = async (req, res) => {
  try {
    await ServiceRequest.findByIdAndDelete(req.params.id);
    res.json({ message: "Service request deleted." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getServiceRequests,
  getUserServiceRequests,
  createServiceRequest,
  updateServiceRequest,
  deleteServiceRequest,
};
