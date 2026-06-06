const express = require("express");
const router = express.Router();
const {
  getServiceRequests,
  getUserServiceRequests,
  createServiceRequest,
  updateServiceRequest,
  deleteServiceRequest,
} = require("../controllers/serviceRequestController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.get("/", protect, adminOnly, getServiceRequests);
router.post("/", createServiceRequest);
router.get("/user", protect, getUserServiceRequests);
router.put("/:id", protect, adminOnly, updateServiceRequest);
router.delete("/:id", protect, adminOnly, deleteServiceRequest);

module.exports = router;
