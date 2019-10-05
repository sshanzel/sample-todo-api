const _ = require("lodash");
const hashService = require("./hash.service");
const { User } = require("../models/user.model");

async function getUserByUsername(query) {
  const user = await User.findOne({ username: patterns.i.username(query) });

  return user;
}

async function getUsers() {
  const users = await User.find();

  return users;
}

async function createUser(newUser) {
  const user = new User(_.pick(newUser, ["username", "password", "name"]));
  user.password = await hashService.encrypt(user.password);

  return await user.save();
}

const patterns = {
  i: { username: query => new RegExp(`${query}`, `i`) },
  like: { username: query => new RegExp(`^${query}.`, `i`) }
};

module.exports = {
  getUserByUsername,
  getUsers,
  createUser
};
