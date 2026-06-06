const express = require("express");
const router = express.Router();
const { getDocuments, createDocument } = require("../controllers/documentController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.get("/", getDocuments);
router.post("/", protect, adminOnly, createDocument);

module.exports = router;
