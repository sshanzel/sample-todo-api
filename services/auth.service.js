const hashService = require("./hash.service");
const userService = require("./user.service");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const secretKey = process.env.JWT_SECRET || "s@mpl3t0d0@pp";

async function authenticate({ username, password }) {
  const user = await userService.getUserByUsername(username);
  const invalid = "Invalid Username or Password";

  if (!user) return { error: { status: 400, message: invalid } };

  const valid = await hashService.validatePassword(password, user.password);
  if (!valid) return { error: { status: 400, message: invalid } };

  const token = generateToken(
    _.pick(user.toObject(), ["_id", "admin", "username", "name"])
  );
  return { result: token };
}

function generateToken(obj) {
  return jwt.sign(obj, secretKey);
}

function verify(token) {
  try {
    const decoded = jwt.verify(token, secretKey);
    return decoded;
  } catch (ex) {
    return null;
  }
}

module.exports = {
  authenticate,
  generateToken,
  verify
};
