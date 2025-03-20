const mongoose = require('mongoose');

const adminuserSchema = new mongoose.Schema({
    admin_username: { type: String, required: true },
    admin_password: { type: String, required: true },
    profileImage: { type: String, default: null },
    product_added: { type: Date, default: Date.now, required: true },
    status: { type: String, default: 'nonactive' }
});

const AdminUser = mongoose.model('AdminUser', adminuserSchema);

module.exports = AdminUser;
