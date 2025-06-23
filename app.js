const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const db = require("./db/connection.js");
const { getApi } = require("./controllers/api.controller.js");
const { getTopics } = require("./controllers/topics.controller.js");
const {
  getArticles,
  getArticleById,
  addVotesToArticle,
} = require("./controllers/articles.controller.js");
const { getUsers } = require("./controllers/users.controller.js");

const {
  handleServerErrors,
  handlePsqlErrors,
  handleCustomErrors,
} = require("./errors.js");
const {
  getCommentsByArticleId,
  postCommentToArticle,
  removeCommentById,
} = require("./controllers/comments.controller.js");
app.use(cors());
app.use(express.json());

app.get("/api", getApi);
app.get("/api/topics", getTopics);
app.get("/api/articles", getArticles);
app.get("/api/users", getUsers);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles/:article_id/comments", getCommentsByArticleId);
app.post("/api/articles/:article_id/comments", postCommentToArticle);
app.patch("/api/articles/:article_id", addVotesToArticle);
app.delete("/api/comments/:comment_id", removeCommentById);
app.use(express.static(path.join(__dirname, "public")));

app.use(handlePsqlErrors);
app.use(handleCustomErrors);
app.use(handleServerErrors);

module.exports = app;
