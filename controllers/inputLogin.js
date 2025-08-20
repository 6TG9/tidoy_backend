// const jwt = require("jsonwebtoken");
// const bcrypt = require("bcryptjs");
// const User = require("../models/registerModel");
// const twilio = require("twilio");
// const normalizePhone = require("../utils/normalizePhone");

// // Twilio Client
// const client = twilio(
//   process.env.TWILIO_ACCOUNT_SID,
//   process.env.TWILIO_AUTH_TOKEN
// );

// const inputLogin = async (req, res) => {
//   try {
//     const { number, otp, password } = req.body;

//     if (!number) {
//       return res.status(400).json({ message: "Phone number is required" });
//     }

//     const e164 = normalizePhone(number);

//     // Find user
//     const user =
//       (await User.findOne({ number: e164 })) ||
//       (await User.findOne({ number }));

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // 1️⃣ Request OTP
//     if (!otp && !password) {
//       const verification = await client.verify.v2
//         .services(process.env.TWILIO_VERIFY_SERVICE_SID)
//         .verifications.create({ to: e164, channel: "sms" });

//       return res.json({
//         message: "OTP sent successfully",
//         phone: e164,
//         sid: verification.sid,
//         status: verification.status,
//       });
//     }

//     // 2️⃣ Verify OTP Login
//     if (otp) {
//       const verificationCheck = await client.verify.v2
//         .services(process.env.TWILIO_VERIFY_SERVICE_SID)
//         .verificationChecks.create({ to: e164, code: otp });

//       if (verificationCheck.status !== "approved") {
//         return res.status(401).json({ message: "Invalid or expired OTP" });
//       }

     

//       return res.json({
//         message: "OTP login successful",
//         token,
//         user: {
//           id: user._id,
//           number: user.number,
//           name: user.name || "",
//         },
//       });
//     }

//     // 3️⃣ Password Login
//     if (password) {
//       const isMatch = await bcrypt.compare(password, user.password);
//       if (!isMatch) {
//         return res.status(401).json({ message: "Invalid password" });
//       }

//       const token = jwt.sign(
//         { id: user._id, number: user.number },
//         process.env.JWT_SECRET,
//         { expiresIn: "7d" }
//       );

//       return res.json({
//         message: "Password login successful",
//         token,
//         user: {
//           id: user._id,
//           number: user.number,
//           name: user.name || "",
//         },
//       });
//     }

//     return res.status(400).json({ message: "Password or OTP is required" });
//   } catch (err) {
//     console.error("Login error:", err);
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// };

// module.exports = { inputLogin };
