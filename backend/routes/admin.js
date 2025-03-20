var express = require("express");
var router = express.Router();


var validateAdminLogin = require("../middleware/validateAdminLogin");
var adminController = require("../controller/adminController");



// For Admin Register
router.post("/admin-register", adminController.adminUserHandler);
// For Login 
router.post("/admin-login", adminController.adminLoginHandler);
//Only Show Image and Username
router.get("/admin",adminController.adminfetchallUserHandler);
// Fetch the information of Admin
router.get("/admin-dashboard", validateAdminLogin, adminController.adminDashboardHandler);


module.exports = router;
