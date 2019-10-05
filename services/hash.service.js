const bcrypt = require("bcrypt");
const saltSize = 10;

async function encrypt(string) {
  const salt = await bcrypt.genSalt(saltSize);
  const encrypted = await bcrypt.hash(string, salt);

  return encrypted;
}

async function validatePassword(request, encrypted) {
  return await bcrypt.compare(request, encrypted);
}

module.exports = {
  encrypt,
  validatePassword
};
