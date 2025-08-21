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
