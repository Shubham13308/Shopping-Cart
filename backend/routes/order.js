var express=require("express");
var router=express.Router();

var orderController=require("../controller/orderController");

// Store the order details
router.post("/order",orderController.orderDetailHandler);

module.exports=router;
