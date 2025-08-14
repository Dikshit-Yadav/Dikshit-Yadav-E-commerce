const mongoose = require('mongoose');
const alarmSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,  
        required: true,
        ref: 'User' 
    },
    alarmTime: {
        type: Date,  
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'ringed'],  
        default: 'pending'
    }
}, { timestamps: true }); 
const Alarm = mongoose.model('Alarm', alarmSchema);

module.exports = Alarm;
