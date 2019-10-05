require("dotenv").config();
const serverless = require("serverless-http");
const express = require("express");
const app = express();
const auth = require("./routes/auth");
const todos = require("./routes/todos");
const users = require("./routes/users");
const { dbConnect } = require("./services/db");

dbConnect({ dbName: `mongodb://localhost/todo-app` });
app.use(express.json());
app.use("/api/auth", auth);
app.use("/api/todos", todos);
app.use("/api/users", users);

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Listening at port ${port}...`));

// module.exports.handler = serverless(app);
