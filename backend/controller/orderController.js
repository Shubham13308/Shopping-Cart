const Customeruser = require("../models/Customer");
const Product = require("../models/Product");
const Order = require("../models/Order");
const nodemailer = require("nodemailer");
const orderReceiptTemplate = require("../template/orderReceiptTemplate");

const orderDetailHandler = async (req, res) => {
  try {
    const { customer_id, orderCart, points, totalprice } = req.body;

    if (!customer_id) {
      return res.status(400).json({ message: "Customer ID is required" });
    }

    const customerDetails = await Customeruser.findOne({ customer_id });

    if (!customerDetails) {
      return res.status(404).json({ message: "Customer not found" });
    }
    console.log(customerDetails.customer_email)
    if (!customerDetails.customer_email) {
      return res.status(400).json({ message: "Customer email is missing" });
    }

    if (!Array.isArray(orderCart) || orderCart.length === 0) {
      return res.status(400).json({ message: "Order cart is empty or invalid" });
    }

    const productNames = orderCart.map((item) => item.product_name);
    const productDetails = await Product.find({
      product_name: { $in: productNames },
    });

    if (!productDetails.length) {
      return res.status(404).json({ message: "No matching products found in the database" });
    }

    const updatedProducts = [];
    for (let orderItem of orderCart) {
      const product = productDetails.find(
        (p) => p.product_name === orderItem.product_name
      );

      if (!product) {
        return res.status(404).json({
          message: `Product '${orderItem.product_name}' not found in the database`,
        });
      }

      if (product.product_stock < orderItem.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for '${orderItem.product_name}'. Available: ${product.product_stock}, Requested: ${orderItem.quantity}`,
        });
      }

      product.product_stock -= orderItem.quantity;
      updatedProducts.push(product);
    }

    for (let product of updatedProducts) {
      await Product.updateOne(
        { _id: product._id },
        { $set: { product_stock: product.product_stock } }
      );
    }

    let updatePoints = 0;
    if (points === "Add") {
      if (totalprice > 40 && totalprice <= 100) updatePoints = 5;
      else if (totalprice > 100 && totalprice <= 200) updatePoints = 10;
      else if (totalprice > 200 && totalprice <= 500) updatePoints = 15;
      else if (totalprice > 500 && totalprice <= 1000) updatePoints = 40;
      else if (totalprice > 1000 && totalprice <= 2000) updatePoints = 250;
      else if (totalprice > 2000 && totalprice <= 4000) updatePoints = 500;
      else if (totalprice > 4000) updatePoints = 1000;
    }

    if (points === "Redeemed") {
      await Customeruser.updateOne(
        { customer_id },
        { $set: { customer_points: 0 } }
      );
    } else {
      await Customeruser.updateOne(
        { customer_id },
        { $inc: { customer_points: Number(updatePoints) } }
      );
    }

    const order_id = (await Order.countDocuments()) + 1;
    const newOrder = new Order({
      order_id,
      customer_id,
      order_list: orderCart,
      order_price: totalprice,
    });

    await newOrder.save();

    
    const receiptHTML = orderReceiptTemplate(customerDetails, {
      orderNumber: newOrder.order_id,
      orderDate: new Date().toLocaleDateString(),
      items: orderCart,
      total: totalprice,
    });

    console.log("Generated Receipt HTML:", receiptHTML); 

    
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    console.log("Sending email to:", customerDetails.customer_email); 

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: customerDetails.customer_email,
      subject: `Your Order Receipt - Order #${newOrder.order_id}`,
      html: receiptHTML,
    };
    

    await transporter.sendMail(mailOptions);

    return res.status(200).json({
      message: "Order processed successfully and email sent",
      updatedProducts: updatedProducts.map((p) => ({
        product_name: p.product_name,
        remaining_stock: p.product_stock,
      })),
      updatedPoints: updatePoints,
      newCustomerPoints:
        points === "Redeemed"
          ? 0
          : customerDetails.customer_points + updatePoints,
    });
  } catch (error) {
    console.error("Error processing order:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { orderDetailHandler };
