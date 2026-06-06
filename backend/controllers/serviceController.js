const Service = require("../models/Service");

const getServices = async (req, res) => {
  try {
    const services = await Service.find();
    res.json({ services });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createService = async (req, res) => {
  try {
    const service = await Service.create(req.body);
    res.status(201).json({ service });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteService = async (req, res) => {
  try {
    await Service.findByIdAndDelete(req.params.id);
    res.json({ message: "Service removed." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getServices, createService, deleteService };
