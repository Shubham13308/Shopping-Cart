const Counter = require("../models/Counter");
const Customeruser = require("../models/Customer");

const customerAddHandler = async (req, res) => {
  const { customer_name, customer_email, customer_phn } = req.body;

  const customerExist = await Customeruser.findOne({ customer_phn });
  if (customerExist) {
    return res.status(400).json({ message: "Customer already exists" });
  }

  try {
    const counter = await Counter.findOneAndUpdate(
      { id: "customer_id" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    const customerId = `Cust${counter.seq}`;

    const customerDefaultPoints = 0;

    const newCustomer = new Customeruser({
      customer_id: customerId,
      customer_name,
      customer_email,
      customer_phn,
      customer_points: customerDefaultPoints,
    });

    await newCustomer.save();
    res
      .status(201)
      .json({ message: "Customer added successfully", customerId });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const customerverifyHandler = async (req, res) => {
  const { customer_phn } = req.body;
  try {
    const customer = await Customeruser.findOne({ customer_phn });
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res
      .status(200)
      .json({ message: "Customer verified successfully", customer });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = { customerAddHandler,customerverifyHandler };
