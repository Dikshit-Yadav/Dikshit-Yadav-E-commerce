const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const User = require('../models/User');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/orders', authMiddleware, async (req, res) => {
  if (req.userRole !== 'user') return res.send("Admins don't have user orders");
  const user = await User.findById(req.userId).populate('name');
  const orders = await Order.find({ userId: req.userId }).populate('products.productId');
  res.render('orders', { orders, userRole: req.userRole,user });
});

router.get('/admin/orders', authMiddleware, async (req, res) => {
  if (req.userRole !== 'admin') return res.send("Access Denied");
  const orders = await Order.find().populate('userId').populate('products.productId');
  const user = await User.findById(req.userId).populate('name');
  res.render('adminOrders', { orders, userRole: req.userRole,user });
});

router.post('/admin/orders/update/:orderId', authMiddleware, async (req, res) => {
  if (req.userRole !== 'admin') return res.send("Access Denied");

  const orderId = req.params.orderId;
  const { status } = req.body;

  await Order.findByIdAndUpdate(orderId, { status });
  res.redirect('/admin/orders');
});

router.delete('/delete/:orderId',authMiddleware, async (req, res) => {
  const { orderId } = req.params;
  await Order.findOneAndDelete({ _id: orderId, userId: req.userId });
  res.redirect("/orders");
})



module.exports = router;
