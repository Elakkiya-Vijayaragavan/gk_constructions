const ServiceRequest = require("../models/ServiceRequest");
const User = require("../models/User");

const getUserRequests = async (req, res) => {
  try {
    const requests = await ServiceRequest.find({ email: req.user.email }).sort({ createdAt: -1 });
    res.json({ requests });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    user.name = name || user.name;
    user.email = email ? email.toLowerCase() : user.email;
    user.phone = phone || user.phone;
    await user.save();
    res.json({ user: { name: user.name, email: user.email, phone: user.phone, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getUserRequests, updateUserProfile };
