const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const User = require("../models/User");
const transporter = require("../routes/utility/transport");
const nodemailer = require("nodemailer")
require("dotenv").config();


const secret = process.env.JWT_SECRET;

router.get("/", (req, res) => {
  res.render("forgot-password");
});

router.post("/", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.send("No user found with this email.");
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '10m' });

    const resetLink = `http://localhost:3000/reset-password/${token}`;

    await transporter.sendMail({
      from: `"QuickCart" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Password Reset",
      html: `
        <p>You requested a password reset</p>
        <p><a href="${resetLink}">Click here to reset</a></p>
        <p>This link expires in 10 minutes</p>
      `,
    });

    res.send("Reset link sent to your email.");
  } catch (err) {
    console.error(err);
    res.status(500).send("Something went wrong.");
  }
});


module.exports = router;
