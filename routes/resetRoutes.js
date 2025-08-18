const express = require("express");
const resetPassword = require("../controllers/resetPassword");
const resetMiddleware = require("../middleware/resetmiddleman");

const router = express.Router();

// Reset password route (protected)
router.post("/reset-password", resetMiddleware, resetPassword);

module.exports = router;
