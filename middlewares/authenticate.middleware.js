const authService = require("../services/auth.service");

module.exports = function(req, res, next) {
  const token = req.headers["x-auth-token"];
  if (!token) return res.status(401).send("Access denied! No token provided!");

  const decoded = authService.verify(token);
  if (!decoded) return res.status(401).send("Invalid Token!");

  req.user = decoded;
  next();
};
