// const bcrypt = require("bcrypt");
// const saltSize = 10;

// "bcrypt" is not working on Lambda. Will soon provide an encryption package

async function encrypt(password) {
  // const salt = await bcrypt.genSalt(saltSize);
  // const encrypted = await bcrypt.hash(password, salt);

  return password;
}

async function validatePassword(password, encrypted) {
  // return await bcrypt.compare(request, encrypted);
  return password === encrypted;
}

module.exports = {
  encrypt,
  validatePassword
};
