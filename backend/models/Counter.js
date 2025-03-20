const mongoose = require('mongoose');


const counterSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true }, 
    seq: { type: Number, default: 100 }, 
});

const Counter = mongoose.model('Counter', counterSchema);

module.exports = Counter;
