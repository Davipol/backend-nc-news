const seed = require("../db/seeds/seed.js");
const { fetchTopics } = require("../models/topics.model.js");

const getTopics = (request, response) => {
  fetchTopics().then((topics) => {
    response.status(200).send({ topics });
  });
};

module.exports = { getTopics };
