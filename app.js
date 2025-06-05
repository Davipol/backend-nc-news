const express = require("express");
const app = express();
const db = require("./db/connection.js");

const { getApi } = require("./controllers/api.controller.js");
const { getTopics } = require("./controllers/topics.controller.js");
const { getArticles } = require("./controllers/articles.controller.js");
const { getUsers } = require("./controllers/users.controller.js");
const {
  handleServerErrors,
  handlePsqlErrors,
  handleCustomErrors,
} = require("./errors.js");

app.get("/api", getApi);
app.get("/api/topics", getTopics);
app.get("/api/articles", getArticles);
app.get("/api/users", getUsers);

app.use(handlePsqlErrors);
app.use(handleCustomErrors);
app.use(handleServerErrors);

module.exports = app;
