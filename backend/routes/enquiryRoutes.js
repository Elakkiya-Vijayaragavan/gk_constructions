const express = require("express");
const router = express.Router();
const { getEnquiries, createEnquiry, updateEnquiry } = require("../controllers/enquiryController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.get("/", protect, adminOnly, getEnquiries);
router.post("/", createEnquiry);
router.put("/:id", protect, adminOnly, updateEnquiry);

module.exports = router;
