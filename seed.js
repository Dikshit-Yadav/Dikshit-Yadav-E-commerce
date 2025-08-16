require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

const { ObjectId } = mongoose.Types;
const products = [
  {
    createdBy: new ObjectId('689f3d223901d10fd9e06f86'),
    name: 'Seven Horses',
    description: 'Nice Painting',
    price: 1,
    image: 'image-1754982744579-488194404',
    category: 'Painting',
    stock: 50
  },
  {
    createdBy: new ObjectId('689f3d223901d10fd9e06f86'),
    name: 'Vivo T4x 5g',
    description: '6 GB RAM | 128 GB ROM\r\n17.07 cm (6.72 inch) Display',
    price: 13999,
    image: 'image-1755067352136-283542417',
    category: 'Smartphone ',
    stock: 50
  },
  {
    createdBy: new ObjectId('689f3d223901d10fd9e06f86'),
    name: 'Checked Shirt',
    description: 'Men regular fit Checked Shirt',
    price: 899,
    image: 'image-1755067955031-750890934',
    category: 'Upper Wear',
    stock: 50
  },
  {
    createdBy: new ObjectId('689f3d223901d10fd9e06f86'),
    name: 'Shirt',
    description: 'Men regular fit shirt',
    price: 500,
    image: 'image-1755068021340-580154194',
    category: 'Upper Wear',
    stock: 50
  },
  {
    createdBy: new ObjectId('689f3d223901d10fd9e06f86'),
    name: 'Men Footwear ',
    description: 'Light Weight and Comfort',
    price: 399,
    image: 'image-1755068086632-546069368',
    category: 'Footwear ',
    stock: 50
  },
  {
    createdBy: new ObjectId('689f3d223901d10fd9e06f86'),
    name: 'T-shirt Rounded neck',
    description: 'Rounded neck Over size',
    price: 299,
    image: 'image-1755068157814-692318402',
    category: 'Upper Wear',
    stock: 50
  },
  {
    createdBy: new ObjectId('689f3d223901d10fd9e06f86'),
    name: 'Rounded T-shirt',
    description: 'Rounded neck and over size',
    price: 350,
    image: 'image-1755068205444-700919931',
    category: 'Upper Wear',
    stock: 50
  },
  {
    createdBy: new ObjectId('689f3d223901d10fd9e06f86'),
    name: 'Shoes',
    description: 'comfort and affordable',
    price: 500,
    image: 'image-1755068243603-628041582',
    category: 'Footwear ',
    stock: 50
  },
  {
    createdBy: new ObjectId('689f3d223901d10fd9e06f86'),
    name: 'Sneaker White',
    description: 'Red tape Sneaker ',
    price: 1700,
    image: 'image-1755068319395-505376527',
    category: 'Footwear ',
    stock: 50
  },
  {
    createdBy: new ObjectId('689f3d223901d10fd9e06f86'),
    name: 'Sports Shoes ',
    description: 'Sports shoes and light weight',
    price: 1200,
    image: 'image-1755068380929-967516284',
    category: 'Footwear ',
    stock: 50
  },
  {
    createdBy: new ObjectId('689f3d223901d10fd9e06f86'),
    name: 'Apple Smart Watch',
    description: 'Smart Features premium look',
    price: 37799,
    image: 'image-1755068616476-393346080',
    category: 'Watch',
    stock: 50
  },
  {
    createdBy: new ObjectId('689f3d223901d10fd9e06f86'),
    name: 'Smart watch ',
    description: 'Black color smart features ',
    price: 3650,
    image: 'image-1755068665545-318479509',
    category: 'Watch',
    stock: 50
  },
  {
    createdBy: new ObjectId('689f3d223901d10fd9e06f86'),
    name: 'Boat Power Bank',
    description: 'easly charges three phones and 25000mh battery ',
    price: 949,
    image: 'image-1755068735519-502599205',
    category: 'Power Bank',
    stock: 50
  },
  {
    createdBy: new ObjectId('689f3d223901d10fd9e06f86'),
    name: 'Firebolt Watch',
    description: 'Firebolt watch and health care app and light weight',
    price: 5000,
    image: 'image-1755068799639-495881878',
    category: 'Watch',
    stock: 50
  },
  {
    createdBy: new ObjectId('689f3d223901d10fd9e06f86'),
    name: 'Samsung Laptop',
    description: '16gb ram, 1024gb ssd\r\ni9 processor window 12',
    price: 70000,
    image: 'image-1755068897214-927330741',
    category: 'Laptop',
    stock: 50
  },
  {
    createdBy: new ObjectId('689f3d223901d10fd9e06f86'),
    name: 'Lenova Laptop',
    description: '16gb ram, 1024gb ssd\r\ni9 processor window 12',
    price: 60000,
    image: 'image-1755068930548-157780616',
    category: 'Laptop',
    stock: 50
  },
  {
    createdBy: new ObjectId('689f3d223901d10fd9e06f86'),
    name: 'Smart Camera',
    description: '24 hrs on assess  anywhere ',
    price: 1099,
    image: 'image-1755069142987-853587165',
    category: 'Camera',
    stock: 50
  },
  {
    createdBy: new ObjectId('689f3d223901d10fd9e06f86'),
    name: 'Phone Holder',
    description: 'phoned hold easily ',
    price: 200,
    image: 'image-1755069192035-228879307',
    category: 'Holder',
    stock: 50
  },
  {
    createdBy: new ObjectId('689f3d223901d10fd9e06f86'),
    name: "Boat earbuds",
    description: "boAt Airdopes Alpha with 35 HRS Playback",
    price: 899,
    image: "data:image/jpeg;base64,/9j/2wBDAAoHBwgHBgoICAgLCgoLDhgQDg0NDh0VFhEYIx8…",
    category: "Earphones ",
    stock: 50
  },
  {
    createdBy: new ObjectId('689f3d223901d10fd9e06f86'),
    name: 'Neck Comforter',
    description: 'Sleepsia Velvet Neck Travel Pillow I Travel Pillow for Long Road Trips and Flights',
    price: 219,
    image: 'image-1755110002749-795000299',
    category: 'Comforter',
    stock: 50
  }
];

async function main() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');

    await Product.deleteMany({});
    console.log('Old products cleared');

    await Product.insertMany(products);
    console.log('Products seeded successfully');

  } catch (err) {
    console.error('Error during seeding:', err);
  } finally {
    await mongoose.disconnect();
  }
}

main();
