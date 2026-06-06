const Document = require("../models/Document");

const getDocuments = async (req, res) => {
  try {
    const documents = await Document.find();
    res.json({ documents });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createDocument = async (req, res) => {
  try {
    const document = await Document.create(req.body);
    res.status(201).json({ document });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getDocuments, createDocument };
