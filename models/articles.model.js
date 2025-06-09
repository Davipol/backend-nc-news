const db = require("../db/connection.js");

const selectArticles = () => {
  const queryString = `
  SELECT 
  articles.author, 
  articles.title, 
  articles.article_id, 
  articles.topic, 
  articles.created_at, 
  articles.votes, 
  articles.article_img_url,
  COUNT (comments.comment_id)::INT AS comment_count 
  FROM articles 
  LEFT JOIN comments ON articles.article_id = comments.article_id
  GROUP BY articles.article_id
  ORDER BY articles.created_at DESC;`;
  return db.query(queryString).then(({ rows }) => {
    return rows;
  });
};

const checkArticleExists = (article_id) => {
  const queryString = `SELECT * FROM articles WHERE article_id = $1;`;
  return db.query(queryString, [article_id]).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({
        status: 404,
        msg: `No article found`,
      });
    }
  });
};
const selectArticleById = (article_id) => {
  const queryString = `SELECT * FROM articles WHERE article_id = $1;`;
  return db.query(queryString, [article_id]).then(({ rows }) => {
    const article = rows[0];
    if (!article) {
      return Promise.reject({
        status: 404,
        msg: `No article found`,
      });
    }
    return article;
  });
};

const updateVotesToArticle = (article_id, inc_votes) => {
  if (inc_votes === undefined || typeof inc_votes !== "number") {
    return Promise.reject({
      status: 400,
      msg: "Invalid input",
    });
  }
  const queryString = `UPDATE articles SET votes=votes+ $1
  WHERE article_id = $2 RETURNING *`;
  return db.query(queryString, [inc_votes, article_id]).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({
        status: 404,
        msg: "Article not found",
      });
    }
    return rows[0];
  });
};

module.exports = {
  selectArticles,
  selectArticleById,
  updateVotesToArticle,
  checkArticleExists,
};
