const mongoose = require('mongoose');

const productuserSchema = new mongoose.Schema({
    product_id: { type: String, required: true },
    product_name: { type: String, required: true },
    product_category: { type: String, required: true },
    product_price: { type: Number, required: true }, 
    product_stock: { type: Number, required: true }, 
    product_image: { type: String, required: true },
    product_description:{type:String,required:true} 
});

const Product = mongoose.model('Product', productuserSchema);

module.exports = Product;
