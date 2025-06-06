const seed = require("../db/seeds/seed.js");
const {
  selectArticles,
  selectArticleById,
} = require("../models/articles.model");
const {
  handleServerErrors,
  handleCustomErrors,
  handlePsqlErrors,
} = require("../errors.js");

const getArticles = (request, response, next) => {
  selectArticles()
    .then((articles) => {
      response.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
};

const getArticleById = (request, response, next) => {
  const { article_id } = request.params;
  selectArticleById(article_id)
    .then(
      ({
        article_id,
        title,
        topic,
        author,
        body,
        created_at,
        votes,
        article_img_url,
      }) => {
        response.status(200).send({
          article: {
            author,
            title,
            article_id,
            body,
            topic,
            created_at,
            votes,
            article_img_url,
          },
        });
      }
    )
    .catch((err) => {
      next(err);
    });
};

module.exports = { getArticles, getArticleById };
