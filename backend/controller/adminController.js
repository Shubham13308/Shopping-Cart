const multer = require("multer");
const bcrypt = require('bcrypt');
const AdminUser = require("../models/AdminUser");
const jwt = require("jsonwebtoken");
const path = require("path");


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/avatars/");
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage }).single('profileImage');

const adminUserHandler = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: "Error uploading image", error: err.message });
        }

        const { admin_username, admin_password } = req.body;

        const adminexist = await AdminUser.findOne({ admin_username });
        if (adminexist) {
            return res.status(400).json({ message: "Admin user already exists" });
        }

        try {
            const hashedPassword = await bcrypt.hash(admin_password, 10);

            const newAdminUser = new AdminUser({
                admin_username,
                admin_password: hashedPassword,
                profileImage: req.file ? req.file.path : null,
            });

            await newAdminUser.save();

            return res.status(201).json({ message: "Admin user created successfully", admin: newAdminUser });
        } catch (error) {
            return res.status(500).json({ message: "Internal server error", error });
        }
    });
};
const adminfetchallUserHandler = async (req, res) => {
    try {
        
        const adminUsers = await AdminUser.find({}, 'admin_username profileImage status');

        
        if (adminUsers.length === 0) {
            return res.status(404).json({ message: "No admin users found." });
        }

        
        return res.status(200).json({ message: "Admin users retrieved successfully", adminUsers });
    } catch (error) {
        console.error("Error fetching admin users:", error);
        return res.status(500).json({ message: "Internal server error", error });
    }
};



const adminLoginHandler = async (req, res) => {
    const { admin_username, admin_password } = req.body;
    try {
        
        const adminlogin = await AdminUser.findOne({ admin_username });
        if (!adminlogin) {
            return res.status(400).json({ message: "Invalid admin username or password" });
        }

        
        const passwordMatch = await bcrypt.compare(admin_password, adminlogin.admin_password);
        if (!passwordMatch) {
            return res.status(400).json({ message: "Invalid admin username or password" });
        }

        
        const { profileImage } = adminlogin;

        
        const token = jwt.sign(
            { id: adminlogin._id, admin_username, profileImage },
            process.env.SECRET_KEY,
            { expiresIn: "1h" }
        );

        return res.status(200).json({ message: "Login successful", token });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error });
    }
};


const adminDashboardHandler = async (req, res) => {
    const adminData = req.admin;  
    
    res.status(200).json({
        status: "success",
        message: "Welcome To Dashboard",
        data: {
            adminId: adminData.id,
            admin_username: adminData.admin_username,
            profileImage: adminData.profileImage,
        },
    });
};

module.exports = { adminUserHandler,adminfetchallUserHandler, adminLoginHandler, adminDashboardHandler };
