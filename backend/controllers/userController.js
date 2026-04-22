const User = require("../models/User");

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// REGISTER
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const trimmedName = name?.trim();
    const normalizedEmail = email?.trim().toLowerCase();

    if (!trimmedName || !normalizedEmail || !password) {
      return res.status(400).json({ message: "Name, email, and password are required." });
    }

    if (!EMAIL_REGEX.test(normalizedEmail)) {
      return res.status(400).json({ message: "Please provide a valid email address." });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long." });
    }

    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(409).json({ message: "An account with this email already exists." });
    }

    const user = new User({ name: trimmedName, email: normalizedEmail, password });
    const saved = await user.save();

    res.status(201).json(saved);

  } catch (error) {
    if (error?.code === 11000) {
      return res.status(409).json({ message: "An account with this email already exists." });
    }
    res.status(400).json({ message: error.message });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email?.trim().toLowerCase();

    if (!normalizedEmail || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    if (!EMAIL_REGEX.test(normalizedEmail)) {
      return res.status(400).json({ message: "Please provide a valid email address." });
    }
    const user = await User.findOne({ email: normalizedEmail, password });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json(user);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};