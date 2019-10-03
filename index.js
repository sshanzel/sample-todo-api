require("dotenv").config();
const express = require("express");
const app = express();
const todos = require("./routes/todos");
const users = require("./routes/users");
const { dbConnect } = require("./services/db");

dbConnect({ dbName: `mongodb://localhost/todo-app` });
app.use(express.json());
app.use("/api/todos", todos);
app.use("/api/users", users);

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Listening at port ${port}...`));
