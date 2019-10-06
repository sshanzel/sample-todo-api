const Joi = require("@hapi/joi");
const express = require("express");
const router = express.Router();
const authorize = require("../middlewares/authorize/todo.middleware");
const admin = require("../middlewares/administrator.middleware");
const authenticate = require("../middlewares/authenticate.middleware");
const todoService = require("../services/todo.service");
const { executePost, executePatch } = require("../helpers/index");

router.get("/", authenticate, admin, async (req, res) => {
  const { data, error } = await todoService.getTodos();
  if (error) return res.status(error.status).send(error.message);

  res.send(data);
});

router.get("/me", authenticate, async (req, res) => {
  const { data, error } = await todoService.getTodosByUser(req.user._id);
  if (error) return res.status(error.status).send(error.message);

  res.send(data);
});

router.get("/:_id", authenticate, async (req, res) => {
  const { _id } = req.params;

  const { data, error } = await todoService.getTodo(_id);
  if (error) return res.status(error.status).send(error.message);

  if (data.author !== req.user._id || !req.user.admin)
    return res.status(403).send("Access Forbidden!");

  res.send(data);
});

router.post("/", authenticate, async (req, res) => {
  const { error: vError } = validate(req.body);
  if (vError) return res.status(400).send(vError.details);

  const todo = { ...req.body, author: req.user._id };
  const { error, result } = await executePost(todoService.createTodo, todo);
  if (error) return res.status(400).send(error);

  return res.send(result);
});

router.patch("/:_id", authenticate, authorize.sender, async (req, res) => {
  const { _id } = req.params;
  const todo = req.body;

  const { error: vError } = validate(todo);
  if (vError) return res.status(400).send(vError.details);

  const { result, error } = await executePatch(
    todoService.updateTodo,
    _id,
    todo
  );

  if (error) return res.status(error.status).send(error.message);

  res.send(result);
});

router.delete("/:_id", authenticate, async (req, res) => {
  const { _id } = req.params;

  const { result, error } = await todoService.deleteTodo(_id);
  if (error) return res.status(400).send(error.details);

  res.send("Successfully Deleted!");
});

function validate(todo) {
  const schema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().allow(""),
    completed: Joi.bool(),
    due: Joi.date(),
    author: Joi.any().allow("")
  });

  return Joi.validate(todo, schema);
}

module.exports = router;
