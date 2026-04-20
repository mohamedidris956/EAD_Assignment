const User = require("../models/User");

// REGISTER
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const user = new User({ name, email, password });
    const saved = await user.save();

    res.status(201).json(saved);

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email, password });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json(user);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};