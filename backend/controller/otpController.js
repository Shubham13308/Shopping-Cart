require("dotenv").config();
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const OTP = require("../models/OTP");
const otpEmailTemplate = require("../template/otpEmailTemplate");
const otpRateLimiter = require("../middleware/otpRateLimiter")

const generateOTP = () => crypto.randomInt(100000, 999999).toString();

const sendOTP = async (req, res) => {
  const { email } = req.body;
  console.log(email);
  if (!email) return res.status(400).json({ success: false, message: "Email is required" });
  const otp = generateOTP();

  try {
    
    otpRateLimiter(req, res, async () => {
      await OTP.create({ email, otp });

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Your OTP Code",
        html: otpEmailTemplate(otp),
      };

      await transporter.sendMail(mailOptions);
      return res.status(200).json({ success: true, message: "OTP sent successfully" });
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to send OTP", error });
  }
};

const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.status(400).json({ success: false, message: "Email and OTP are required" });
  }

  try {
    
    const storedOTP = await OTP.findOne({ email, otp });

    if (!storedOTP) {
      return res.status(400).json({ success: false, message: "Invalid OTP or OTP has expired" });
    }

    
    const createdAt = storedOTP.createdAt.getTime(); 
    const expiresAt = createdAt + 5 * 60 * 1000; 
    const remainingTime = Math.max(0, Math.floor((expiresAt - Date.now()) / 1000));

    
    await OTP.deleteOne({ email });

    return res.status(200).json({ 
      success: true, 
      message: "OTP Verified Successfully",
      remainingTime: `${remainingTime} seconds left before expiry`
    });

  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to verify OTP", error });
  }
};

module.exports = {sendOTP ,verifyOTP};
