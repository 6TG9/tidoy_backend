const Register = require("../models/registerModel");

const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

// THE REGISTER CONTROLLER

const register = async (req, res) => {
  const { name, email, number, password, confirmPassword } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Name is required" });
  }

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  if (!number) {
    return res.status(400).json({ message: "Number is required" });
  }

  if (!password) {
    return res.status(400).json({ message: "Password is required" });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Password Mismatch" });
  }

  //   =============================

  const salt = await bcryptjs.genSalt(10);
  const saltedPassword = await bcryptjs.hash(password, salt);

  //   ===============================================

  try {
    const registerUser = await Register.create({
      name,
      email,
      number,
      password: saltedPassword,
    });

    console.log(registerUser);
    res.status(201).json({ message: "Registered Successfully" }, registerUser);
  } catch (err) {
    console.error(err);
  }
};

module.exports = register;
