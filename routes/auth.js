const Joi = require("@hapi/joi");
const express = require("express");
const router = express.Router();
const authService = require("../services/auth.service");

router.post("/", async (req, res) => {
  const credentials = req.body;

  const { error: vError } = validate(credentials);
  if (vError) return res.status(400).send(vError.details);

  const { result, error } = await authService.authenticate(credentials);
  if (error) return res.status(error.status).send(error.message);

  res.send(result);
});

function validate(req) {
  const schema = Joi.object({
    username: Joi.string()
      .required()
      .min(6)
      .max(16),
    password: Joi.string()
      .required()
      .min(8)
      .max(16)
  });

  return Joi.validate(req, schema);
}

module.exports = router;
