const express = require("express");
const {
  register,
  login,
  loginPhone,
  getUser,
} = require("../controllers/registerController");

const getUserMiddleMan = require("../middleware/getUser");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/loginPhone", loginPhone);
router.get("/me", getUserMiddleMan, getUser);

module.exports = router;
