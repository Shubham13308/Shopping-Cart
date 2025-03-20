const multer = require("multer");
const Product = require("../models/Product");
const path = require("path");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/products/");
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage }).single('product_image');

const productAddHandler = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: err.message });
        }

        const { product_name, product_category, product_description, product_price, product_stock } = req.body;
        const product_image = req.file ? req.file.filename : null; 

        const productExist = await Product.findOne({ product_name });
        if (productExist) {
            return res.status(400).json({ message: "Product already exists" });
        }

        
        const generateProductId = async (category) => {
            const prefixes = {
                "Electronics": "El",
                "Food": "FO",
                "Home": "HO",
                "Books": "BO",
                "Toys": "TO",
                "Accessories": "Acc",
                "Wearables": "We",
                "Clothing":"Cl"
            };

            const prefix = prefixes[category];
            if (!prefix) {
                throw new Error("Invalid category");
            }

            const latestProduct = await Product.findOne({
                product_category: category
            }).sort({ createdAt: -1 }); 

            let latestNumber = 100; 
            if (latestProduct && latestProduct.product_id.startsWith(prefix)) {
                latestNumber = parseInt(latestProduct.product_id.slice(2), 10) + 1;
            }

            return `${prefix}${latestNumber}`;
        };

        try {
            const product_id = await generateProductId(product_category);

            
            const newProduct = new Product({
                product_name,
                product_category,
                product_description,
                product_price,
                product_stock,
                product_image,
                product_id
            });

            await newProduct.save(); 
            return res.status(201).json({ message: "Product added successfully", product: newProduct });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal server error" });
        }
    });
};

const fetchProductHandler = async (req, res) => {
    try {
        
        const products = await Product.find();

        
        if (!products || products.length === 0) {
            return res.status(404).json({ message: "No products found" });
        }

        
        return res.status(200).json({ products });
    } catch (error) {
        console.error("Error fetching products:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const searchProductHandler = async (req, res) => {
    try {
        const { query } = req.query; 
        

        if (!query) {
            return res.status(400).json({ message: "Search query is required" });
        }

        const products = await Product.find({
            product_name: { $regex: query, $options: "i" }
        });

        if (products.length === 0) {
            return res.status(404).json({ message: "No products found" });
        }

        return res.status(200).json({
            message:"Product Fetch Sucessfully",
            data:products,
            type:"Search"
            


        } );
    } catch (error) {
        console.error("Error searching product:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = { productAddHandler,fetchProductHandler,searchProductHandler };
