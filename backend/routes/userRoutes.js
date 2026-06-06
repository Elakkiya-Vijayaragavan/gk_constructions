const express = require("express");
const router = express.Router();
const { getUserRequests, updateUserProfile } = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

router.get("/requests", protect, getUserRequests);
router.put("/profile", protect, updateUserProfile);

module.exports = router;
