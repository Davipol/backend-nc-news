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

const insertCommentToArticle = (article_id, username, body) => {
  return checkArticleExists(article_id).then(() => {
    const queryString = `INSERT INTO comments (author, body, article_id) VALUES($1, $2, $3) RETURNING *`;
    return db
      .query(queryString, [username, body, article_id])
      .then(({ rows }) => {
        return rows[0];
      });
  });
};
module.exports = { selectCommentsByArticleId, insertCommentToArticle };
