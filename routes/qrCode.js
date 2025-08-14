const express = require('express');
const router = express.Router();
const QRCode = require('qrcode');
const authMiddleware = require('../middlewares/authMiddleware');
const oredr = require('../models/Order')


router.get('/upi-payment', async (req, res) => {
    const transactionId = "ORD123456"; 
    const upiLink = `upi://pay?pa=${process.env.MERCHANT_VPA}&pn=MerchantName&tid=${transactionId}&tn=${process.env.TRANSACTION_NOTE}&am=${amount}&cu=${process.env.CURRENCY}`;

    try {
        const qrCodeImageUrl = await QRCode.toDataURL(upiLink);
        res.render('qrcode.ejs');

    } catch (error) {
        console.error('Error generating QR code:', error);
        res.status(500).send('Failed to generate QR code');
    }
});


router.post('/upi-payment',authMiddleware,async(req,res)=>{
    const{amount, transactionId}= req.body;
    if (!amount || !transactionId) {
        return res.status(400).json({ error: 'Amount and transactionId are required' });
    }
    const upiLink = `upi://pay?pa=${process.env.MERCHANT_VPA}&pn=MerchantName&tid=${transactionId}&tn=${process.env.TRANSACTION_NOTE}&am=${amount}&cu=${process.env.CURRENCY}`;
    try{
        const qrCode = await QRCode.toDataURL(upiLink);
        res.json({ qrCode: qrCode});
    }catch(error){
        console.log("Error generating qrcode:",error);
        res.status(500).json({error: "Failed to generate qrcode"});
    }
})

module.exports = router;