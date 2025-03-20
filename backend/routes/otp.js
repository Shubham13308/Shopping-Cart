var express = require("express");
var router=express.Router();
var otpController=require("../controller/otpController");
var otpRateLimiter= require("../middleware/otpRateLimiter");
// send otp 
router.post("/sendOtp",otpController.sendOTP);

// verify otp
router.post("/verifyOtp",otpController.verifyOTP);

module.exports=router;