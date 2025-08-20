const express = require("express");
const {
  register,
  login,
  loginPhone,
} = require("../controllers/registerController");

const getUserMiddleMan = require("../middleware/getUser");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/loginPhone", loginPhone);

module.exports = router;
