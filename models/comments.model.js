const db = require("../db/connection.js");

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

const selectCommentsByArticleId = (article_id) => {
  return checkArticleExists(article_id).then(() => {
    const queryString = `SELECT comment_id, votes, created_at, author, body, article_id FROM comments WHERE comments.article_id = $1 ORDER BY comments.created_at DESC`;
    return db.query(queryString, [article_id]).then(({ rows: comments }) => {
      return comments;
    });
  });
};

module.exports = { selectCommentsByArticleId };
