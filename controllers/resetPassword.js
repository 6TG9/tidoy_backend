const bcrypt = require("bcryptjs");
const User = require("../models/registerModel");

const resetPassword = async (req, res) => {
  try {
    const {newPassword, confirmNewPassword } = req.body;
    const userId = req.user.id; // from auth middleware

    // 1. Validate input
    if (!newPassword || !confirmNewPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // 2. Find user
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // 4. Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    // 5. Save new password
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error(err); // 👈 see the real error in your terminal
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = resetPassword;
