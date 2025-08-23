// backend/middleware/authMiddleware.js
module.exports.protect = (req, res, next) => {
  req.user = { id: "demoUser", email: "demo@example.com" }; // always allow
  next();
};
