const express = require("express");
const mongoose = require("mongoose");
const app = express();
app.use(express.json());  
const cors = require("cors");
require("dotenv").config({});
const adminrouter=require('./routes/admin');
const productrouter=require('./routes/product');
const customerrouter=require('./routes/customer');
const otprouter=require('./routes/otp');
const orderrouter=require('./routes/order');
// const grouprouter = require('./routes/grouproutes');  
// const memberrouter = require('./routes/memberdetailroutes')
app.use('/uploads', express.static('uploads'));
app.use(cors({
  origin: '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  allowedHeaders: ['Content-Type', 'Authorization'], 
  credentials: true 
}));

app.use('/admin', adminrouter);  
app.use('/product', productrouter);
app.use('/customer',customerrouter);
app.use('/otp',otprouter);
app.use('/order',orderrouter);
// app.use('/memberdetailroute',memberrouter);


mongoose.connect(process.env.MONGO_DB_URI)
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.error("MongoDB connection error:", err));



const PORT = process.env.PORT ;  
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});