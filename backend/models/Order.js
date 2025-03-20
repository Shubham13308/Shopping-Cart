const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  order_id: { type: Number, required: true, unique: true },
  customer_id: { type: String, required: true },
  order_list: [
    {
      product_name: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
    },
  ],
  order_price: { type: Number, required: true },
  order_date: { type: Date, required: true, default: Date.now },
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
