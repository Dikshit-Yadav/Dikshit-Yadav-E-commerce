const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', authMiddleware, async (req, res) => {
  try {
    const products = await Product.find();
    const user = await User.findById(req.userId).populate('name');
    res.render('home', { products, userRole: req.userRole,user });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

module.exports = router;