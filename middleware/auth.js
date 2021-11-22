const jwt = require("jsonwebtoken");
require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET;

function auth(req, res, next) {
  const token = req.header("x-auth-token");

  // Check for token
  if (!token) {
    res
      .status(401)
      .json({ valid: false, msg: "No token, authorization denied" });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    // Add user from payload
    req.user = decoded;

    next(); // call next piece of middleware
  } catch (e) {
    res.status(400).json({ valid: false, msg: "Token is not valid" });
  }
}

module.exports = auth;
