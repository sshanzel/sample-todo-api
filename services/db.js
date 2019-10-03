const mongoose = require("mongoose");

function dbConnect({ dbName }) {
  const dbUri = process.env.NODE_ENV
    ? dbName
    : `mongodb+srv://rwuser:${process.env.DBPASSWORD}@cluster0-s5nbo.mongodb.net/test?retryWrites=true&w=majority`;

  mongoose
    .connect(dbUri)
    .then(() => {
      console.log("success");
    })
    .catch(err => {
      console.log("Can't connect to DB ", dbUri);
    });
}

module.exports = {
  dbConnect
};
