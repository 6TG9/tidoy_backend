const Register = require("../models/registerModel");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ====================== REGISTER CONTROLLER ======================
const register = async (req, res) => {
  const { name, email, number, password, confirmPassword } = req.body;

  if (!name) return res.status(400).json({ message: "Name is required" });
  if (!email) return res.status(400).json({ message: "Email is required" });
  if (!number) return res.status(400).json({ message: "Number is required" });
  if (!password)
    return res.status(400).json({ message: "Password is required" });
  if (password !== confirmPassword)
    return res.status(400).json({ message: "Password Mismatch" });

  try {
    // Hash password
    const salt = await bcryptjs.genSalt(10);
    const saltedPassword = await bcryptjs.hash(password, salt);

    // Save user
    const registerUser = await Register.create({
      name,
      email,
      number,
      password: saltedPassword,
    });

    // Generate JWT
    const token = jwt.sign(
      { id: registerUser._id, email: registerUser.email },
      process.env.JWT_SECRET, // ✅ put a strong secret in .env
      { expiresIn: "1h" } // expires in 1 hour
    );

    console.log(registerUser);
    res.status(201).json({
      message: "Registered Successfully",
      user: registerUser,
      token, // send token back
    });
  } catch (err) {
    console.error("Error registering user:", err);
    res.status(500).json({ message: "Server error while registering" });
  }
};

// ====================== FETCH ALL DATA CONTROLLER ======================
const fetchAllData = async (req, res) => {
  try {
    const fetchData = await Register.find(); // ✅ fetch all users
    res.status(200).json(fetchData);
    console.log(fetchData);
  } catch (err) {
    console.log("Failed to fetch data", err);
    res.status(500).json({ message: "Server error while fetching data" });
  }
};

// ====================== EXPORTS ======================
module.exports = { register, fetchAllData };
