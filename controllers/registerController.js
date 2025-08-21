const Register = require("../models/registerModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const LoginHistory = require("../models/loginHistory");

// ================= REGISTER ===================
const register = async (req, res) => {
  const { name, email, number, password, confirmPassword } = req.body;

  // 🔹 basic validation
  if (!name) return res.status(400).json({ message: "Name is required" });
  if (!email) return res.status(400).json({ message: "Email is required" });
  if (!number) return res.status(400).json({ message: "Number is required" });
  if (!password)
    return res.status(400).json({ message: "Password is required" });
  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Password Mismatch" });
  }

  try {
    // 🔹 check if user already exists
    const existingUser = await Register.findOne({
      $or: [{ email }, { number }],
    });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Email or number already in use" });
    }

    // 🔹 hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 🔹 save user
    const registerUser = await Register.create({
      name,
      email,
      number,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "Registered Successfully",
      newUser: {
        id: registerUser._id,
        name: registerUser.name,
        email: registerUser.email,
        number: registerUser.number,
      },
    });
  } catch (err) {
    console.error("🔥 Register error:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// ================= LOGIN WITH NAME ===================
const login = async (req, res) => {
  const { name, password } = req.body;

  if (!name || !password) {
    return res.status(400).json({ message: "Name and password are required" });
  }

  try {
    const user = await Register.findOne({ name });
    if (!user) {
      await LoginHistory.create({
        userId: null,
        loginType: "name",
        status: "failed",
      });
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      await LoginHistory.create({
        userId: user._id,
        loginType: "name",
        status: "failed",
      });
      return res.status(401).json({ message: "Invalid password" });
    }
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }

    const token = jwt.sign(
      { id: user._id, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    await LoginHistory.create({
      userId: user._id,
      loginType: "name",
      status: "success",
    });

    const { password: _, ...userData } = user.toObject();

    res
      .status(200)
      .json({ message: "Login Successful", user: userData, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// ================= LOGIN WITH PHONE ===================
const loginPhone = async (req, res) => {
  const { number, password } = req.body;

  if (!number || !password) {
    return res
      .status(400)
      .json({ message: "Number and password are required" });
  }

  try {
    // ✅ find user by number only
    const user = await Register.findOne({ number });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("📌 User found:", user);
    console.log("📌 Password input:", password);
    console.log("📌 Stored password:", user.password);

    // ✅ compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // ✅ generate JWT
    const token = jwt.sign(
      { id: user._id, number: user.number },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // ✅ don’t expose password
    const { password: _, ...userData } = user.toObject();

    await LoginHistory.create({
      userId: user._id,
      loginType: "phone",
      status: isMatch ? "success" : "failed",
    });

    res.status(200).json({
      message: "Login Successful",
      user: userData,
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// ==================================================

const getUser = async (req, res) => {
  try {
    const user = await Register.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({
      message: "User fetched successfully",
      user, // comes from middleware
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { register, login, loginPhone, getUser };
