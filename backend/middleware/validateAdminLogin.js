const jwt = require("jsonwebtoken");


const validateAdminLogin = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(403).json({
      status: "error",
      message: tokenerror.tokenProviderError(),
    });
  }
  
  jwt.verify(token.split(" ")[1], process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).json({
        status: "error",
        message: "Invalid or expired token",
      });
    }

    req.admin = decoded; 
    next(); 
  
  })
};

module.exports = validateAdminLogin;
