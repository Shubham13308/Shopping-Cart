const mongoose = require('mongoose');

const customeruserSchema = new mongoose.Schema({
  customer_id: { type: String, required: true, unique: true },
  customer_name: { type: String, required: true },
  customer_phn: { type: String, required: true },
  customer_email: { type: String, required: true },
  customer_points: { type: Number, default: 0 }, 
});

const Customeruser = mongoose.model('Customeruser', customeruserSchema);

module.exports = Customeruser;
