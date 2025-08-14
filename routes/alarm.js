    const express = require('express');
    const router = express.Router();
    const authenticate = require('../middlewares/authMiddleware');
    const moment = require('moment');
    const Alarm = require('../models/Alarm');

    router.get('/alarm', authenticate, async (req, res) => {
    try {
        const alarm = await Alarm.findOne({ userId: req.userId }).sort({ alarmTime: -1 });
        res.render('alarm', { alarm, error: null });
    } catch (error) {
        res.status(500).render('alarm', { alarm: null, error: 'Failed to load alarm' });
    }
});


    router.post('/set-alarm', authenticate, async (req, res) => {
    const { durationHours, durationMin } = req.body;

    const hours = parseInt(durationHours) || 0;
    const minutes = parseInt(durationMin) || 0;
    const totalMin = hours * 60 + minutes;

    if (isNaN(totalMin) || totalMin <= 0) {
        return res.status(400).render('alarm', { 
            alarm: null,
            error: 'Please enter a valid duration'
        });
    }

    try {
        const alarmTime = moment().add(totalMin, 'minutes').toDate();

        const newAlarm = new Alarm({
            userId: req.userId,
            alarmTime,
            status: 'pending'
        });

        await newAlarm.save();

        res.redirect('/alarm'); 
    } catch (error) {
        console.error('Error setting alarm:', error);
        res.status(500).render('alarm', { 
            alarm: null,
            error: 'Internal server error'
        });
    }
});


    module.exports = router;
