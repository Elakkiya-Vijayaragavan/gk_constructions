const express = require("express");
const router = express.Router();
const { getServices, createService, deleteService } = require("../controllers/serviceController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.get("/", getServices);
router.post("/", protect, adminOnly, createService);
router.delete("/:id", protect, adminOnly, deleteService);

module.exports = router;
