const Gallery = require("../models/Gallery");

const getGallery = async (req, res) => {
  try {
    const photos = await Gallery.find();
    res.json({ photos });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createGalleryPhoto = async (req, res) => {
  try {
    const photo = await Gallery.create(req.body);
    res.status(201).json({ photo });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getGallery, createGalleryPhoto };
