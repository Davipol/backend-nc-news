const seed = require("../db/seeds/seed.js");
const { fetchTopics } = require("../models/topics.model.js");
const {
  handleServerErrors,
  handleCustomErrors,
  handlePsqlErrors,
} = require("../errors.js");

const getTopics = (request, response, next) => {
  fetchTopics()
    .then((topics) => {
      response.status(200).send({ topics });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = { getTopics };
