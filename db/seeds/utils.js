const db = require("../../db/connection");
const articleData = require("../data/development-data/articles.js");
const commentData = require("../data/development-data/comments.js");
const topicData = require("../data/development-data/topics.js");
const userData = require("../data/development-data/users.js");

exports.convertTimestampToDate = ({ created_at, ...otherProperties }) => {
  if (!created_at) return { ...otherProperties };
  return { created_at: new Date(created_at), ...otherProperties };
};

exports.compatibleArticleData = (articleData) => {
  return articleData.map(exports.convertTimestampToDate);
};

exports.compatibleCommentData = (commentData) => {
  return commentData.map(exports.convertTimestampToDate);
};

exports.addArticleIdToComments = (commentsData, insertedArticles) => {
  const articleLookup = {};
  insertedArticles.forEach(({ article_id, title }) => {
    articleLookup[title] = article_id;
  });
  return commentsData.map(({ article_title, ...rest }) => {
    return {
      ...rest,
      article_id: articleLookup[article_title],
    };
  });
};
