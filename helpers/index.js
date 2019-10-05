const mongoose = require("mongoose");

async function executePost(command, obj) {
  try {
    const result = await command(obj);

    return { result };
  } catch (err) {
    const error = err.errors || err;

    return { error: { status: 400, message: error } };
  }
}

async function executePatch(command, _id, obj) {
  try {
    const { result, error } = await command(_id, obj);
    if (!result || error)
      return { error: { status: 400, message: "Not Found!" } };

    return { result };
  } catch (err) {
    const error = err.errors || err;

    return { error: { status: 400, message: error } };
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
  executePost,
  executePatch,
  validObjectId
};
