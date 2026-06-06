const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const JWT_SECRET = process.env.JWT_SECRET || "lk_constructions_secret";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "kavihari155@gmail.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Admin@123";

const createToken = (user) => jwt.sign({ id: user._id, role: user.role, email: user.email }, JWT_SECRET, { expiresIn: "7d" });

const registerUser = async (req, res) => {
  const { name, email, password, phone } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Name, email, and password are required." });
  }

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    return res.status(400).json({ message: "Email is already registered." });
  }

  if (email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
    return res.status(403).json({ message: "Admin account cannot be registered from this form." });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email: email.toLowerCase(), password: hashedPassword, phone, role: "user" });

  return res.status(201).json({
    user: { name: user.name, email: user.email, phone: user.phone, role: user.role },
    token: createToken(user),
  });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email) {
    return res.status(400).json({ message: "Email is required." });
  }

  const lowerEmail = email.toLowerCase();

  if (lowerEmail === ADMIN_EMAIL.toLowerCase()) {
    let user = await User.findOne({ email: lowerEmail });
    if (!user) {
      const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
      user = await User.findOneAndUpdate(
        { email: lowerEmail },
        { email: lowerEmail, password: hashedPassword, name: "Owner", role: "admin" },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }

    return res.json({
      user: { name: user.name, email: user.email, phone: user.phone, role: user.role },
      token: createToken(user),
    });
  }

  let user = await User.findOne({ email: lowerEmail });
  if (!user) {
    const passwordHash = await bcrypt.hash(Math.random().toString(36).slice(2), 10);
    user = await User.create({
      name: email.split("@")[0],
      email: lowerEmail,
      password: passwordHash,
      role: "user",
    });
  }

  return res.json({
    user: { name: user.name, email: user.email, phone: user.phone, role: user.role },
    token: createToken(user),
  });
};

module.exports = { registerUser, loginUser };
