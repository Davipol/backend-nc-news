const db = require("./connection");
const seed = require("../db/seeds/seed");
const articleData = require("./data/development-data/articles.js");
const commentData = require("./data/development-data/comments.js");
const topicData = require("./data/development-data/topics.js");
const userData = require("./data/development-data/users.js");

const getSeed = () => {
  return seed({ topicData, userData, articleData, commentData });
};
const queryAllUsers = () => {
  return getSeed().then(() => {
    return db.query(`SELECT * FROM users`);
  });
};

const queryArticlesAboutCoding = () => {
  return getSeed().then(() => {
    return db.query(`SELECT * FROM articles
            WHERE topic='coding'`);
  });
};

const queryCommentsWithLessThanZeroVotes = () => {
  return getSeed().then(() => {
    return db.query(`SELECT * FROM comments WHERE votes<0`);
  });
};

const queryAllTopics = () => {
  return getSeed().then(() => {
    return db.query(`SELECT * FROM topics`);
  });
};

const queryArticlesbyUser = () => {
  return getSeed().then(() => {
    return db.query(`SELECT * FROM articles
            WHERE author='grumpy19'`);
  });
};

const queryCommentsWithMoreThanTenVotes = () => {
  return getSeed().then(() => {
    return db.query(`SELECT * FROM comments WHERE votes>10`);
  });
};
