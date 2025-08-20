require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const twilio = require("twilio");

// Routes
const registerRouter = require("./routes/registerRoute");

const app = express();
const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * ✅ Send OTP (Twilio Verify)
 * Example: GET /generate-otp/+2348012345678
 */
// app.get("/generate-otp/:number", async (req, res) => {
//   try {
//     const { number } = req.params;

//     const verification = await client.verify.v2
//       .services(process.env.TWILIO_VERIFY_SERVICE_SID)
//       .verifications.create({ to: number, channel: "sms" });

//     res.json({
//       message: "OTP sent successfully",
//       to: number,
//       sid: verification.sid,
//       status: verification.status,
//     });
//   } catch (err) {
//     console.error("Send OTP error:", err);
//     res.status(500).json({
//       message: "Failed to send OTP",
//       error: err.message,
//     });
//   }
// });

/**
 * ✅ Verify OTP (Twilio Verify)
 * Example: GET /verify-otp/+2348012345678/123456
 */
// app.get("/verify-otp/:number/:code", async (req, res) => {
//   try {
//     const { number, code } = req.params;

//     const verificationCheck = await client.verify.v2
//       .services(process.env.TWILIO_VERIFY_SERVICE_SID)
//       .verificationChecks.create({ to: number, code });

//     if (verificationCheck.status === "approved") {
//       return res.json({
//         message: "OTP verified successfully",
//         to: number,
//         status: verificationCheck.status,
//       });
//     }

//     res.status(400).json({
//       message: "Invalid or expired OTP",
//       status: verificationCheck.status,
//     });
//   } catch (err) {
//     console.error("Verify OTP error:", err);
//     res.status(500).json({
//       message: "Failed to verify OTP",
//       error: err.message,
//     });
//   }
// });

app.use("/api/auth", registerRouter);

const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {});
    console.log("Database connected");

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (err) {
    console.error("Error starting server:", err.message);
  }
};

start();

// andrewmjr2
// f2Fl5Mnk3oYvi9Zj
// mongodb+srv://andrewmjr2:f2Fl5Mnk3oYvi9Zj@cluster0.pkfprc1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
