const mongoose = require("mongoose");

async function executePostCommand(command, obj, req, res) {
  try {
    const result = await command(obj);
    return res ? res.send(result) : result;
  } catch (err) {
    const errors = err.errors || err;
    return res ? res.status(400).send(errors) : errors;
  }
}

async function executePatchCommand(command, _id, obj, req, res) {
  try {
    const execute = await command(_id, obj);
    if (!execute) return res.status(404).send("Not found!");

    return res ? res.send(execute.result) : execute.result;
  } catch (err) {
    const errors = err.errors || err;

    return res ? res.status(400).send(errors) : errors;
  }
}

function validObjectId(_id) {
  try {
    mongoose.Types.ObjectId(_id);
    return true;
  } catch (err) {
    return false;
  }
}

module.exports = {
  executePostCommand,
  executePatchCommand,
  validObjectId
};
