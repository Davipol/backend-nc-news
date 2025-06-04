const express = require("express");
const app = express();
const db = require("./db/connection.js");

const { getApi } = require("./controllers/api.controller.js");
const { getTopics } = require("./controllers/topics.controller.js");

app.get("/api", getApi);
app.get("/api/topics", getTopics);

module.exports = app;
