const authService = require("../services/auth.service");

module.exports = function(req, res, next) {
  const token = req.get("X-Api-Key");
  if (!token) return res.status(401).send("Access denied! No token provided!");

  try {
    const decoded = authService.verify(token);
    req.user = decoded;
    next();
  } catch (ex) {
    return res.status(401).send("Invalid Token!");
  }
};
