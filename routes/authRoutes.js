const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const checkLoggedIn = require('../middlewares/checkLoggedIn');
const transporter = require("../routes/utility/transport");
const {handelLogin} = require('../controllers/authController');
let otpObj = {};
const JWT_SECRET = process.env.JWT_SECRET;

router.get('/register', checkLoggedIn, (req, res) => res.render('register'));

router.post('/register', exports.handelLogin =   async (req, res) => {
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
});

router.get("/verify", (req, res) => {
  res.render("Verify");
});
router.post("/verify", async (req, res) => {
  const { email, otp } = req.body;

  console.log("entered OTP:", otp);
  console.log("stored OTP:", otpObj.otp);

  if (otpObj.otp !== otp) {
    return res.send("Invalid OTP");
  }

  const { name, password, role } = otpObj;
  const user = new User({ name, email: otpObj.email, password, role });
  await user.save();
  otpObj = {}
  res.redirect("/login");
});

router.get('/login', checkLoggedIn, (req, res) => res.render('login'));

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.send("Invalid credentials");

    if (user.password !== password) return res.send("Invalid credentials");

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: "1d" });
    res.cookie("token", token, { httpOnly: true });

    if (user.role === 'admin') {
      res.redirect('/admin');
    } else {
      res.redirect('/products');
    }
  } catch (err) {
    res.send("error: " + err.message);
  }
});

router.get('/logout', (req, res) => {
  res.clearCookie("token");
  res.redirect('/login');
});

module.exports = router;
