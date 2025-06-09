const seed = require("../db/seeds/seed.js");
const {
  handleServerErrors,
  handleCustomErrors,
  handlePsqlErrors,
} = require("../errors.js");
const {
  selectCommentsByArticleId,
  insertCommentToArticle,
  deleteCommentById,
} = require("../models/comments.model.js");

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

const postCommentToArticle = (request, response, next) => {
  const { article_id } = request.params;
  const { username, body } = request.body;
  if (isNaN(article_id)) {
    return next({
      status: 400,
      msg: "Invalid article_id",
    });
  }
  if (!username || !body) {
    return next({
      status: 400,
      msg: "Please insert username and body",
    });
  }
  insertCommentToArticle(article_id, username, body)
    .then((comment) => {
      response.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};

const removeCommentById = (request, response, next) => {
  const { comment_id } = request.params;
  deleteCommentById(comment_id)
    .then(() => {
      response.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = {
  getCommentsByArticleId,
  postCommentToArticle,
  removeCommentById,
};
