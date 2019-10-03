const Joi = require("@hapi/joi");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const {
  executePostCommand,
  executePatchCommand,
  validObjectId
} = require("../helpers/index");

router.get("/", async (req, res) => {
  if (!req.query._id) return res.send(await Todo.find());

  const { _id } = res.query;
  if (!validObjectId(_id)) return res.status(404).send("Not found!");

  const { result } = await Todo.find({ author: _id });
  return result;
});

router.post("/", async (req, res) => {
  const todo = req.body;

  const { error } = validateTodo(todo);
  if (error) return res.status(400).send(error.details);

  return await executePostCommand(createTodo, todo, req, res);
});

router.patch("/:_id", async (req, res) => {
  const _id = req.params._id;
  if (!validObjectId(_id)) return res.status(404).send("Todo not found");

  const { error } = validateTodo(req.body);
  if (error) return res.status(400).send(error.details);

  return await executePatchCommand(updateTodo, _id, req.body, req, res);
});

router.delete("/:_id", async (req, res) => {
  const _id = req.params._id;
  if (!validObjectId(_id)) return res.status(404).send("Todo not found");

  Todo.findByIdAndDelete(_id, err => {
    if (err) return res.status(400).send(err);

    res.send("Successfully Deleted");
  });
});

async function createTodo(newTodo) {
  const todo = new Todo(newTodo);
  const { result } = await todo.save();

  return result;
}

async function updateTodo(_id, todo) {
  const result = await Todo.findOneAndUpdate({ _id: _id }, todo);

  return result;
}

function validateTodo(todo) {
  return Joi.validate(todo, todoSchemaValidation);
}

const todoSchemaValidation = Joi.object({
  title: Joi.string().required()
});

const todoSchemaProperties = {
  title: { type: String, required: true },
  description: String,
  owner: { type: mongoose.Types.ObjectId, ref: "Users" }
};

const todoSchema = new mongoose.Schema(todoSchemaProperties);
const Todo = mongoose.model("Todos", todoSchema);

module.exports = router;
