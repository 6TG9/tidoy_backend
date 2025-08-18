const express = require("express");
const router = express.Router();
const {
  inputLogin,
} = require("../controllers/inputLogin");

router.post("/login",inputLogin);;

module.exports = router;
