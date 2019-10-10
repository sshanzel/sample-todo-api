const express = require("express");
const app = express();
const local = require("./app");

app.use(local);
