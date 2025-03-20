const otpEmailTemplate = (otp) => `
  <div style="font-family: Arial, sans-serif; padding: 20px; text-align: center; background-color: #f4f4f4;">
    <div style="max-width: 400px; margin: auto; background: white; padding: 20px; border-radius: 10px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);">
      <h2 style="color: #333;">Your OTP Code</h2>
      <p style="font-size: 16px; color: #555;">Use the following OTP to verify your account:</p>
      <h1 style="font-size: 28px; color: #007BFF; margin: 10px 0;">${otp}</h1>
      <p style="font-size: 14px; color: #888;">This OTP is valid for <strong>5 minutes</strong>. Do not share it with anyone.</p>
      <hr style="border: none; height: 1px; background: #ddd;">
      <p style="font-size: 12px; color: #aaa;">If you did not request this OTP, please ignore this email.</p>
    </div>
  </div>
`;

module.exports = otpEmailTemplate;
