const Joi = require("@hapi/joi");
const _ = require("lodash");
const express = require("express");
const router = express.Router();
const { executePost } = require("../helpers/index");
const userService = require("../services/user.service");
const authService = require("../services/auth.service");
const authenticate = require("../middlewares/authenticate.middleware");
const admin = require("../middlewares/administrator.middleware");

router.get("/", authenticate, admin, async (req, res) => {
  res.send(await userService.getUsers());
});

router.post("/", async (req, res) => {
  const user = req.body;

  const { error: vError } = validate(user);
  if (vError) return res.status(400).send(vError.details);

  if (await userService.getUserByUsername(user.username))
    return res.status(400).send("Username is already taken");

  const { result, error } = await executePost(userService.createUser, user);
  if (error) return res.status(error.status).send(error.message);

  const token = authService.generateToken({ _id: result._id });
  res
    .header("X-Api-Key", token)
    .send(_.pick(result, ["_id", "admin", "username", "name"]));
});

function validate(user) {
  const schema = Joi.object({
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

  return Joi.validate(user, schema);
}

module.exports = router;
