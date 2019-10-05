const mongoose = require("mongoose");

const todoSchemaProperties = {
  title: { type: String, required: true },
  description: String,
  author: { type: mongoose.Types.ObjectId, ref: "User" }
};

const todoSchema = new mongoose.Schema(todoSchemaProperties);
const Todo = mongoose.model("Todo", todoSchema);

module.exports = {
  Todo
};
