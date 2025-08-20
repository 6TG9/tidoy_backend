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

    // ================================================

    const token = jwt.sign(
      { userID: registerUser._id },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "3d", // expires in 3 days
      }
    );

    res.status(201).json({
      message: "Registered Successfully",
      newUser: {
        name: registerUser.name,
        id: registerUser._id,
        email: registerUser.email,
        number: registerUser.number,
      },
      token,
    });
  } catch (err) {
    console.error(err);
  }
};

// ======================================================================

// const getUser = async (req, res) => {
//   const user = await Register.findById(req.user.userID);

//   if (!user) {
//     res.status(400).json({ message: "User not found" });
//   }

//   res.status(200).json({
//     id: user._id,
//     name: user.name,
//     email: user.email,
//     number: user.number,
//   });
// };

module.exports = register;
