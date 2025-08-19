const express = require("express");
const { register, fetchAllData } = require("../controllers/registerController");

const router = express.Router();

router.post("/register", register);
router.get("/users", fetchAllData);

module.exports = router;
