const seed = require("../db/seeds/seed.js");
const {
  handleServerErrors,
  handleCustomErrors,
  handlePsqlErrors,
} = require("../errors.js");
const { selectCommentsByArticleId } = require("../models/comments.model.js");

const getCommentsByArticleId = (request, response, next) => {
  const { article_id } = request.params;
  selectCommentsByArticleId(article_id)
    .then((comments) => {
      response.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = { getCommentsByArticleId };
