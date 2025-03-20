const generateOrderReceiptHTML = (customer, order) => {
    if (!customer || !order) {
      throw new Error('Customer and Order information is required');
    }
    
  
    
    const { orderNumber, orderDate, items, total } = order;
  
    // Ensure order items are correctly structured
    if (!Array.isArray(items) || items.length === 0) {
      throw new Error('Order must contain items');
    }
  
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Order Receipt</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  background-color: #f4f4f4;
                  margin: 0;
                  padding: 0;
              }
              .container {
                  width: 100%;
                  max-width: 600px;
                  margin: 0 auto;
                  background-color: #fff;
                  padding: 20px;
                  border-radius: 8px;
                  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
              }
              h1 {
                  color: #333;
                  text-align: center;
              }
              .order-details {
                  margin-top: 20px;
              }
              .order-details p {
                  margin: 10px 0;
              }
              .order-items {
                  width: 100%;
                  margin-top: 20px;
                  border-collapse: collapse;
              }
              .order-items th, .order-items td {
                  padding: 8px;
                  text-align: left;
                  border-bottom: 1px solid #ddd;
              }
              .order-items th {
                  background-color: #f4f4f4;
              }
              .total-price {
                  margin-top: 20px;
                  text-align: right;
                  font-size: 18px;
                  font-weight: bold;
                  color: #333;
              }
              .footer {
                  margin-top: 40px;
                  text-align: center;
                  font-size: 12px;
                  color: #888;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <h1>Order Receipt</h1>
              <p>Dear ${customer.customer_name},</p>
              <p>Thank you for your order! Below are the details:</p>
              
              <div class="order-details">
                  <p><strong>Order Number:</strong> ${orderNumber}</p>
                  <p><strong>Order Date:</strong> ${orderDate}</p>
             
              </div>
              
              <table class="order-items">
                  <thead>
                      <tr>
                          <th>Item</th>
                          <th>Quantity</th>
                          <th>Price</th>
                          <th>Total</th>
                      </tr>
                  </thead>
                  <tbody>
                      ${items
                        .map(
                          (item) => `
                      <tr>
                          <td>${item.product_name}</td>
                          <td>${item.quantity}</td>
                          <td>₹${item.price.toFixed(2)}</td>
                          <td>₹${(item.price * item.quantity).toFixed(2)}</td>
                      </tr>`
                        )
                        .join("")}
                  </tbody>
              </table>
              
              <div class="total-price">
                  <p><strong>Total Amount:</strong> ₹${total.toFixed(2)}</p>
              </div>
              
              <p>If you have any questions, please don't hesitate to contact us.</p>
              
              <div class="footer">
                  <p>&copy; ${new Date().getFullYear()} Your Company Name. All rights reserved.</p>
                  <p>If you did not make this order, please contact us immediately.</p>
              </div>
          </div>
      </body>
      </html>
    `;
  };
  
  module.exports = generateOrderReceiptHTML;
  