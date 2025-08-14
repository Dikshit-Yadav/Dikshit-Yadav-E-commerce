require('dotenv').config();
const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');
const QRCode = require('qrcode');
const Razorpay = require('razorpay');
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// console.log("Razorpay Key ID:", process.env.RAZORPAY_KEY_ID);
// console.log("Razorpay Key Secret:", process.env.RAZORPAY_KEY_SECRET);
// console.log(razorpayInstance);

const authMiddleware = require('../middlewares/authMiddleware');

router.post('/cart/add/:productId', authMiddleware, async (req, res) => {
  if (req.userRole !== 'user') return res.send("Admins can't add to cart");

  const productId = req.params.productId;
  let cart = await Cart.findOne({ userId: req.userId });

  if (!cart) {
    cart = new Cart({ userId: req.userId, products: [{ productId }] });
  } else {
    const item = cart.products.find(p => p.productId.toString() === productId);
    if (item) {
      item.quantity += 1;
    } else {
      cart.products.push({ productId });
    }
  }

  await cart.save();
  res.redirect('/cart');
});

router.get('/cart', authMiddleware, async (req, res) => {
  if (req.userRole !== 'user') return res.send("Admins don't have a cart");
  const user = await User.findById(req.userId).populate('name');
  const cart = await Cart.findOne({ userId: req.userId }).populate('products.productId');
  res.render('cart', { cart, userRole: req.userRole, user });
});

router.get('/cart/remove/:productId', authMiddleware, async (req, res) => {
  if (req.userRole !== 'user') return res.send("Admins don't have a cart");

  const productId = req.params.productId;
  await Cart.updateOne(
    { userId: req.userId },
    { $pull: { products: { productId } } }
  );
  res.redirect('/cart');
});

router.get('/cart/checkout', authMiddleware, async (req, res) => {
  if (req.userRole !== 'user') return res.send("Admins can't checkout");
  const cart = await Cart.findOne({ userId: req.userId })
    .populate('products.productId');
  // console.log(cart);
  if (!cart || cart.products.length === 0) return res.send("Cart is empty");

  const validItems = cart.products.filter(item => item.productId);

  if (validItems.length === 0) return res.send("All items in your cart are unavailable.");

  let totalAmount = 0;
  validItems.forEach(item => {
    totalAmount += item.productId.price * item.quantity;
  });

  res.render('checkout', {
    orderId: cart._id,
    cartItems: validItems,
    totalAmount
  });
});

router.post('/place-order', authMiddleware, async (req, res) => {
  try {

    if (req.userRole !== 'user') {
      return res.send("Admins can't checkout");
    }

    const {
      productId,
      'bill-Name': billName,
      'bill-Email': billEmail,
      'bill-Address': billAddress,
      'bill-City': billCity,
      'bill-Zip': billZip,
      shippingName,
      shippingAddress,
      shippingCity,
      shippingZip,
    } = req.body;

    let products = [];
    let totalPrice = 0;

    if (productId) {
      const product = await Product.findById(productId);
      if (!product) return res.send("Product not found");

      products.push({ productId: product._id, quantity: 1 });
      totalPrice = product.price;
    } else {
      const cart = await Cart.findOne({ userId: req.userId }).populate('products.productId');
      if (!cart || cart.products.length === 0) return res.send("Cart is empty");

      cart.products.forEach(item => {
        if (item.productId) {
          products.push({ productId: item.productId._id, quantity: item.quantity });
          totalPrice += item.productId.price * item.quantity;
        }
      });

      await Cart.deleteOne({ userId: req.userId });
    }


    try {
      const razorpayOrder = await razorpayInstance.orders.create({
        amount: totalPrice * 100,
        currency: 'INR',
        receipt: `order_receipt_${Date.now()}`
      });

      if (!razorpayOrder) return res.status(500).send("Failed to create Razorpay order");

      const order = new Order({
        userId: req.userId,
        products,
        totalPrice,
        billingInfo: {
          name: billName,
          email: billEmail,
          address: billAddress,
          city: billCity,
          zip: billZip
        },
        shippingInfo: {
          name: shippingName || billName,
          address: shippingAddress || billAddress,
          city: shippingCity || billCity,
          zip: shippingZip || billZip
        }
      });

      await order.save();
      res.redirect("/orders")

    } catch (err) {
      console.error('Razorpay Error:', err);
      return res.status(500).send("Failed to create Razorpay order");
    }

  } catch (err) {
    console.error('Error in place-order route:', err);
    res.status(500).send("Something went wrong on the server");
  }
});



router.get('/orders/:orderId', authMiddleware, async (req, res) => {
  const order = await Order.findOne({ _id: req.params.orderId, userId: req.userId }).populate('products.productId');
  const user = await User.findById(req.userId).populate('name');

  if (!order) return res.status(404).send("Order not found");
  res.render('orderDetails', { order, userRole: req.userRole, user, key_id: process.env.RAZORPAY_KEY_ID });
});

router.get('/buy/:productId', authMiddleware, async (req, res) => {
  if (req.userRole !== 'user') return res.send("Admins can't checkout");

  const product = await Product.findById(req.params.productId);
  if (!product) return res.send("Product not found");

  const cartItems = [{ productId: product, quantity: 1 }];
  const totalAmount = product.price;

  res.render('checkout', { cartItems, totalAmount });
});

router.get('/order/:orderId/verify-payment', authMiddleware, async (req, res) => {
  const { paymentId, signature } = req.query;

  const order = await Order.findOne({ _id: req.params.orderId, userId: req.userId });

  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  const razorpayOrderId = order.razorpayOrderId;

  const crypto = require('crypto');
  const secret = process.env.key_secret;
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(razorpayOrderId + "|" + paymentId);
  const generatedSignature = hmac.digest('hex');

  if (generatedSignature === signature) {
    // Payment is verified
    order.paymentStatus = 'paid';
    await order.save();
    return res.json({ message: 'Payment successfully verified.' });
  } else {
    return res.status(400).json({ error: 'Payment verification failed' });
  }
});



module.exports = router;
