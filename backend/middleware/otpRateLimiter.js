const rateLimit = require('express-rate-limit');

const otpRateLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, 
  max: 3, 
  message: {
    success: false,
    message: "Too many OTP requests. Please try again later."
  },
  standardHeaders: true, 
  legacyHeaders: false, 
});

module.exports = otpRateLimiter;
