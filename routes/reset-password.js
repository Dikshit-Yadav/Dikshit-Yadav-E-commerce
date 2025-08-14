const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const User = require("../models/User");

const secret = process.env.JWT_SECRET;

router.get("/:token", async (req, res) => {
  const { token } = req.params;
  if (!token) return res.send("Token is required.");

  try {
    const decoded = jwt.verify(token, secret);


    const user = await User.findById(decoded.id);

    if (!user) {
      return res.send("User not found.");
    }

    res.render("reset-password", { email: user.email, token });
  } catch (err) {
    console.error(err);
    return res.send("Invalid or expired token.");
  }
});

router.post("/:token", async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;
  try {
    const decoded = jwt.verify(token, secret);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.send("User not found.");
    }

    user.password = newPassword;

    await user.save();

    res.redirect("/login");
  } catch (err) {
    console.error(err);
    return res.send("Invalid or expired token.");
  }
});

module.exports = router;
