// middleware/authMiddleware.js
require("dotenv").config();
const jwt = require("jsonwebtoken");

/**
 * Authorization middleware.
 * Expects `Authorization: Bearer <token>` header.
 * On success, adds `req.user = { userId, role, iat, exp }`.
 */
module.exports = function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Missing or malformed authorization header." });
  }

  const token = auth.split(" ")[1];

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, payload) => {
    if (err) {
      console.error("JWT verification failed:", err);
      return res.status(401).json({ message: "Invalid or expired token." });
    }
    // attach user info to request
    req.user = { userId: payload.userId, role: payload.role };
    next();
  });
};
