const { Todo } = require("../models/todo.model");
const { validObjectId } = require("../helpers/index");

async function getTodosByUser(_id) {
  if (!validObjectId(_id))
    return { error: { status: 404, message: "Not found!" } };

  const data = await Todo.find({ author: _id });

  return { data };
}

async function getTodos() {
  const data = await Todo.find();

  return { data };
}

async function getTodo(_id, options) {
  if (!validObjectId(_id))
    return { error: { status: 404, message: "Not found!" } };

  const todo = await Todo.findById(_id);

  return { data: todo };
}

async function createTodo(newTodo) {
  const todo = new Todo(newTodo);
  const result = await todo.save();

  return result;
}

async function updateTodo(_id, todo) {
  if (!validObjectId(_id))
    return { error: { status: 404, message: "Not found!" } };

  const result = await Todo.findOneAndUpdate({ _id: _id }, todo, { new: true });

  return result;
}

async function deleteTodo(_id) {
  if (!validObjectId(_id))
    return { error: { status: 404, message: "Not found!" } };

  Todo.findByIdAndDelete(_id, err => {
    if (err) return { error: { status: 400, message: err } };

    return { result: "Successfully Deleted!" };
  });
}

module.exports = {
  getTodosByUser,
  getTodos,
  getTodo,
  createTodo,
  updateTodo,
  deleteTodo
};
