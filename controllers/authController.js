const User = require('../models/User');
const jwt = require('jsonwebtoken');
const checkLoggedIn = require('../middlewares/checkLoggedIn');
const transporter = require("../routes/utility/transport");

exports.handelLogin =   async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) return res.send("User already exists");
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpObj = { name, email, password, role, otp };
    await transporter.sendMail({
      from:process.env.EMAIL_USER,
      to: email,
      subject: "QuickCart OTP",
      text: `Your One-Time Password (OTP) is: ${otp}. It is valid for 10 minutes. Do not share this code with anyone. `
    });
    res.render("Verify", { email })
  } catch (err) {
    res.send("error: " + err);
  }
}