const express = require("express");
const {
  register,
  login,
  loginPhone,
  getUser,
  getPaginatedUser,
  userCount,
} = require("../controllers/registerController");

const getUserMiddleMan = require("../middleware/getUser");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/loginPhone", loginPhone);
router.get("/me", getUserMiddleMan, getUser);
router.get("/listUsers", getPaginatedUser)
router.get("/count", userCount)

module.exports = router;
