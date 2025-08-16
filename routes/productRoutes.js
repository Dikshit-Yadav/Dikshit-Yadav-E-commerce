const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const User = require('../models/User');
const authMiddleware = require('../middlewares/authMiddleware');
// const upload =require('../middlewares/multer');
const upload = require('../middlewares/multer');
const sharp = require('sharp');

router.get('/products', authMiddleware, async (req, res) => {
  const user = await User.findById(req.userId).populate('name');
  const products = await Product.find();
  res.render('products', { products, userRole: req.userRole,user });
});

router.get('/admin', authMiddleware, async (req, res) => {
  if (req.userRole !== 'admin'){ 
    return res.send("Access Denied")

  };
  const user = await User.findById(req.userId).populate('name');
  // const products = await Product.find();
  const products = await Product.find({ createdBy: req.user._id });

  res.render('adminDashboard', { products, userRole: req.userRole,user });
});

router.get('/admin/add', authMiddleware,  (req, res) => {
  if (req.userRole !== 'admin'){ 
    return res.send("Access Denied")

  };
  res.render('addProduct');
});

router.post('/admin/add', authMiddleware, upload.single('image'), async (req, res) => {
  if (req.userRole !== 'admin') return res.send("Access Denied");

  const { name, description, price, stock, category } = req.body;
  
  const image = req.file ? req.file.filename : null;

  await Product.create({ name, description, price, stock, image, category,createdBy: req.user._id });
  res.redirect('/admin');
});


router.get('/admin/edit/:id', authMiddleware, async (req, res) => {
  if (req.userRole !== 'admin') return res.send("Access Denied");
  // const product = await Product.findById(req.params.id);
  const product = await Product.findOne({ _id: req.params.id, createdBy: req.user._id });
if (!product) return res.status(403).send("Access Denied");

  res.render('editProduct', { product });
});

router.post('/admin/edit/:id', authMiddleware, async (req, res) => {
  if (req.userRole !== 'admin') {
    return res.send("Access Denied")
  };
  const { name, description, price, image, category } = req.body;
  await Product.findByIdAndUpdate(
    // req.params.id,
     { _id: req.params.id, createdBy: req.user._id },
     { name, description, price, image, category });
  res.redirect('/admin');
});

router.get('/admin/delete/:id', authMiddleware, async (req, res) => {
  if (req.userRole !== 'admin') {
    return res.send("Access Denied");
  }
  // await Product.findByIdAndDelete(req.params.id);
  await Product.findOneAndDelete({ _id: req.params.id, createdBy: req.user._id });
  res.redirect('/admin');
});

module.exports = router;
