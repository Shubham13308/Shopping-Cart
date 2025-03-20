var express= require("express");
var router=express.Router();

var customerController=require("../controller/customerController");


// Add Customer
router.post("/add-customer",customerController.customerAddHandler);

// verify Customer

router.post('/verify-customer',customerController.customerverifyHandler)


module.exports=router;