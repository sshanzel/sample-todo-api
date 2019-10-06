const mongoose = require("mongoose");

const todoSchemaProperties = {
  title: { type: String, required: true },
  description: String,
  completed: { type: Boolean, default: false },
  due: { type: Date },
  author: { type: mongoose.Types.ObjectId, ref: "User", required: true }
};

const todoSchema = new mongoose.Schema(todoSchemaProperties);
const Todo = mongoose.model("Todo", todoSchema);

module.exports = {
  Todo
};
