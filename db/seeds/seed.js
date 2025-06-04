const db = require("../connection");
const format = require("pg-format");
const { compatibleData, addArticleIdToComments } = require("./utils.js");
const articleData = require("../data/development-data/articles.js");
const commentData = require("../data/development-data/comments.js");
const topicData = require("../data/development-data/topics.js");
const userData = require("../data/development-data/users.js");

const seed = ({ topicData, userData, articleData, commentData }) => {
  return db
    .query("DROP TABLE IF EXISTS comments")
    .then(() => {
      return db.query("DROP TABLE IF EXISTS articles");
    })
    .then(() => {
      return db.query("DROP TABLE IF EXISTS users");
    })
    .then(() => {
      return db.query("DROP TABLE IF EXISTS topics");
    })
    .then(() => {
      return db.query(`
      CREATE TABLE topics (
      slug VARCHAR(50) PRIMARY KEY,
      description VARCHAR(150),
      img_url VARCHAR(1000)
      );
      `);
    })
    .then(() => {
      return db.query(`CREATE TABLE users (
        username VARCHAR(50) PRIMARY KEY,
        name VARCHAR(100),
        avatar_url VARCHAR(1000)
        );
        `);
    })
    .then(() => {
      return db.query(`CREATE TABLE articles (
        article_id SERIAL PRIMARY KEY,
        title VARCHAR(150),
        topic VARCHAR(50),
        FOREIGN KEY (topic) REFERENCES topics(slug),
        author VARCHAR(50) REFERENCES users(username),
        body TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        votes INT DEFAULT 0,
        article_img_url VARCHAR(1000)
        );
        `);
    })
    .then(() => {
      return db.query(`CREATE TABLE comments (
        comment_id SERIAL PRIMARY KEY,
        article_id INT REFERENCES articles(article_id),
        body TEXT,
        votes INT DEFAULT 0,
        author VARCHAR(50) REFERENCES users(username),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        `);
    })
    .then(() => {
      const formattedTopics = topicData.map(
        ({ description, slug, img_url }) => {
          return [slug, description, img_url];
        }
      );

      const topicsInsert = format(
        `INSERT INTO topics(slug, description, img_url) VALUES %L
          RETURNING*;`,
        formattedTopics
      );
      return db.query(topicsInsert);
    })
    .then(() => {
      const formattedUsers = userData.map(({ username, name, avatar_url }) => {
        return [username, name, avatar_url];
      });
      const usersInsert = format(
        `INSERT INTO users(username, name, avatar_url) VALUES %L
          RETURNING*;`,
        formattedUsers
      );
      return db.query(usersInsert);
    })
    .then(() => {
      const formattedArticlesData = compatibleData(articleData);
      const formattedArticles = formattedArticlesData.map(
        ({
          title,
          topic,
          author,
          body,
          created_at,
          votes,
          article_img_url,
        }) => {
          return [
            title,
            topic,
            author,
            body,
            created_at,
            votes,
            article_img_url,
          ];
        }
      );
      const articlesInsert = format(
        `INSERT INTO articles(
        title,
        topic,
        author,
        body,
        created_at,
        votes,
        article_img_url) VALUES %L
        RETURNING *;`,
        formattedArticles
      );
      return db.query(articlesInsert);
    })
    .then(({ rows }) => {
      const formattedCommentsWithId = addArticleIdToComments(commentData, rows);
      const formattedCommentsData = compatibleData(formattedCommentsWithId);
      const formattedComments = formattedCommentsData.map(
        ({ article_id, body, votes, author, created_at }) => {
          return [article_id, body, votes, author, created_at];
        }
      );

      const commentsInsert = format(
        `INSERT INTO comments (
       article_id, body, votes, author, created_at
        ) VALUES %L
         RETURNING *;`,
        formattedComments
      );
      return db.query(commentsInsert);
    });
};
module.exports = seed;
