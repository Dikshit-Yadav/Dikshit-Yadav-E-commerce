const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/profile', authMiddleware, async(req,res)=>{
const user = await User.findById(req.userId).populate('name email role _id');
res.render('profile',{user,userRole: req.userRole})
})

router.get('/profile/edit',authMiddleware,async(req,res)=>{
const user = await User.findById(req.userId).populate('name email role _id');
     res.render('editprofile',{user})
});

router.post('/profile/update',authMiddleware,async(req,res)=>{
    const{name,email,password} = req.body;
     const updatedData = {
            name,
            email,
            password
        };
    const user = await User.findByIdAndUpdate(req.userId, updatedData, {
            new: true,
        });
          res.redirect('/profile');
})

module.exports = router;