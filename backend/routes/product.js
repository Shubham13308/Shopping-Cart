var express = require("express")
var router= express.Router();

var productController=require("../controller/productController");

// Fetch All Product
router.get("/fetch-product",productController.fetchProductHandler);
// To add Product
router.post("/add-product",productController.productAddHandler);

// Fetch product when search 
router.get("/search", productController.searchProductHandler);

module.exports=router;
