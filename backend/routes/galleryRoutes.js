const express = require("express");
const router = express.Router();
const { getGallery, createGalleryPhoto } = require("../controllers/galleryController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.get("/", getGallery);
router.post("/", protect, adminOnly, createGalleryPhoto);

module.exports = router;
