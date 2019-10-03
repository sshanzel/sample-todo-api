const mongoose = require("mongoose");
const Joi = require("@hapi/joi");
const express = require("express");
const router = express.Router();
const { executePostCommand, validObjectId } = require("../helpers/index");

const patterns = {
  i: { username: query => new RegExp(`${query}`, `i`) },
  like: { username: query => new RegExp(`^${query}.`, `i`) }
};

router.get("/", async (req, res) => {
  res.send(await User.find());
});

router.post("/create", async (req, res) => {
  const user = req.body;

  const { error } = validateUser(user);
  if (error) return res.status(400).send(error.details);

  const existing = await User.find({
    username: patterns.username
  });
  if (existing.length) return res.status(400).send("Username is already taken");

  return await executePostCommand(createUser, user, req, res);
});

router.post("/authenticate", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({
    username: patterns.i.username(username),
    password: password
  });

  if (!user) return res.status(400).send("Invalid username or password!");

  res.send(user);
});

function validateUser(user) {
  return Joi.validate(user, userSchemaValidation);
}

async function createUser(newUser) {
  const user = new User(newUser);

  return await user.save();
}

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  name: { type: String, required: true }
});

const User = mongoose.model("Users", userSchema);

const userSchemaValidation = Joi.object({
  username: Joi.string()
    .required()
    .min(6)
    .max(16),
  password: Joi.string()
    .required()
    .min(8)
    .max(16),
  name: Joi.string().required()
});

module.exports = router;
