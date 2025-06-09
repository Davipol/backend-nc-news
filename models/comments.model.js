const db = require("../db/connection.js");
const { checkArticleExists } = require("./articles.model.js");

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

const deleteCommentById = (comment_id) => {
  const queryString = `DELETE FROM comments WHERE comment_id = $1 returning *;`;
  return db.query(queryString, [comment_id]).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({
        status: 404,
        msg: "Comment Not Found",
      });
    }
    return rows[0];
  });
};
module.exports = {
  selectCommentsByArticleId,
  insertCommentToArticle,
  deleteCommentById,
};
