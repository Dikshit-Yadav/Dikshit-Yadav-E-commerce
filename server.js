const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cookieParser = require('cookie-parser');
const cron = require('node-cron');
const methodOverride = require('method-override');
const Alarm = require('./models/Alarm')

const app = express();
const homeRoute = require('./routes/homeRoute')
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoute');
const orderRoutes = require('./routes/orderRoutes');
const forgotPassword = require('./routes/forgot-password');
const resetPassword = require('./routes/reset-password');
const alarmRoutes = require('./routes/alarm'); 
const profile = require('./routes/profile'); 


async function main() {
  await mongoose.connect(process.env.MONGO_URI);
}
main().then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

cron.schedule('* * * * *', async() => {
   try {
        const currentTime = new Date();

        const alarms = await Alarm.find({
            alarmTime: { $lte: currentTime },
            status: 'pending'
        });

        for (const alarm of alarms) {
            alarm.status = 'ringed';  
            await alarm.save();
            console.log(`Alarm ${alarm._id} has completed.`);
         
        }
    } catch (error) {
        console.error('Error while updating alarms:', error);
    }
});
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/uploads', express.static('uploads'));
app.use(methodOverride('_method'));

app.use('/', profile);
app.use('/', authRoutes);
app.use('/', homeRoute);
app.use('/', productRoutes);
app.use('/', cartRoutes);
app.use('/', orderRoutes);
app.use('/forgot-password', forgotPassword);
app.use('/reset-password', resetPassword);
app.use('/', alarmRoutes);

app.listen(3000, () => console.log(`http://localhost:${3000}`));