const endpointsJson = require("../endpoints.json");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed.js");
const app = require("../app.js");
const data = require("../db/data/test-data");

beforeEach(() => {
  return seed(data);
});
afterAll(() => {
  return db.end();
});

describe("GET /api", () => {
  test("GET 200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});
describe("GET /api/topics", () => {
  test("GET 200 - Responds with an object with the key of topics and the value of an array of topic objects each with a slug and a description property", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const topics = body.topics;
        expect(topics.length).not.toBe(0);
        topics.forEach(({ slug, description }) => {
          expect(typeof slug).toBe("string");
          expect(typeof description).toBe("string");
        });
      });
  });
});
describe("GET /api/articles", () => {
  test("GET 200 - Responds with an object with the key of articles and the value of an array of article objects each with properties of: author, title, article_id, topic, created_at, votes, article_img_url, comment_count", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;
        expect(articles.length).not.toBe(0);
        articles.forEach(
          ({
            author,
            title,
            article_id,
            topic,
            created_at,
            votes,
            article_img_url,
            comment_count,
          }) => {
            expect(typeof author).toBe("string");
            expect(typeof title).toBe("string");
            expect(typeof article_id).toBe("number");
            expect(typeof topic).toBe("string");
            expect(typeof created_at).toBe("string");
            expect(typeof votes).toBe("number");
            expect(typeof article_img_url).toBe("string");
            expect(typeof comment_count).toBe("number");
          }
        );
      });
  });
});
describe("GET /api/articles with sorting and ordering", () => {
  test("GET 200: sorts articles by a valid column", () => {
    return request(app)
      .get("/api/articles?sort_by=title")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        const titles = articles.map((article) => article.title);
        const sortedTitles = [...titles].sort((a, b) => b.localeCompare(a));
        expect(titles).toEqual(sortedTitles);
      });
  });
  test("GET 200: sorts articles by votes in ascending order", () => {
    return request(app)
      .get("/api/articles?sort_by=votes&order=asc")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        const votes = articles.map((article) => article.votes);
        const sortedVotes = [...votes].sort((a, b) => a - b);
        expect(votes).toEqual(sortedVotes);
      });
  });
  test("GET 200: defaults to descending order if order not specified", () => {
    return request(app)
      .get("/api/articles?sort_by=created_at")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        const dates = articles.map((article) =>
          new Date(article.created_at).getTime()
        );
        const sortedDates = [...dates].sort((a, b) => b - a);
        expect(dates).toEqual(sortedDates);
      });
  });
  test("GET 400: responds with error for invalid sort_by column", () => {
    return request(app)
      .get("/api/articles?sort_by=notAValidColumn")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid sort_by query");
      });
  });
  test("400: responds with error for invalid order value", () => {
    return request(app)
      .get("/api/articles?order=invalidOrder")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid order query");
      });
  });
});
describe("GET /api/articles with topic query", () => {
  test("GET 200: responds with the articles about specified topic", () => {
    return request(app)
      .get("/api/articles?topic=mitch")
      .expect(200)
      .then(({ body }) => {
        const articlesByTopic = body.articles;
        expect(articlesByTopic.length).not.toBe(0);
        articlesByTopic.forEach((article) => {
          expect(article).toHaveProperty("topic", "mitch");
        });
      });
  });
  test("GET 200: responds with an empty array when passed a valid topic with no articles", () => {
    return request(app)
      .get("/api/articles?topic=paper")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toEqual([]);
      });
  });
  test("GET 404: responds with an error message when the topic does not exist", () => {
    return request(app)
      .get("/api/articles?topic=nonExistentTopic")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Topic not found");
      });
  });
});
describe("GET /api/users", () => {
  test("GET 200: Responds with an object with the key of users and the value of an array of objects with properties: username, name, avatar_url", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const users = body.users;
        expect(users.length).not.toBe(0);
        users.forEach(({ username, name, avatar_url }) => {
          expect(typeof username).toBe("string");
          expect(typeof name).toBe("string");
          expect(typeof avatar_url).toBe("string");
        });
      });
  });
});
describe("GET /api/articles/:article_id", () => {
  test("GET 200: Responds with an object with a key of article and the value of an article object with the following properties: author, title, article_id, body, topic, created_at, votes, article_img_url, comment_count", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        const article = body.article;
        expect(typeof article).toBe("object");
        const {
          author,
          title,
          article_id,
          body: articleBody,
          topic,
          created_at,
          votes,
          article_img_url,
          comment_count,
        } = article;
        expect(typeof author).toBe("string");
        expect(typeof title).toBe("string");
        expect(typeof article_id).toBe("number");
        expect(typeof articleBody).toBe("string");
        expect(typeof topic).toBe("string");
        expect(typeof created_at).toBe("string");
        expect(typeof votes).toBe("number");
        expect(typeof article_img_url).toBe("string");
        expect(typeof comment_count).toBe("number");
      });
  });
  test("GET 400: responds with an error message if passed a bad article ID", () => {
    return request(app)
      .get("/api/articles/notAnId")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("GET 404: responds with an error message if passed an article ID not present", () => {
    return request(app)
      .get("/api/articles/999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe(`No article found`);
      });
  });
  describe("GET /api/articles/:article_id/comments", () => {
    test("GET 200: Responds with an object with the key of comments and the value of an array of comments for the given article_id, each one with properties: comment_id, votes, created_at, author, body, article_id. Most recent comments should be served first", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body }) => {
          expect(typeof body).toBe("object");
          const comments = body.comments;
          expect(comments.length).not.toBe(0);
          comments.forEach(
            ({ comment_id, votes, created_at, author, body, article_id }) => {
              expect(typeof comment_id).toBe("number");
              expect(typeof votes).toBe("number");
              expect(typeof created_at).toBe("string");
              expect(typeof author).toBe("string");
              expect(typeof body).toBe("string");
              expect(typeof article_id).toBe("number");
            }
          );
        });
    });
    test("GET 200: Responds with an empty array if article exists, but has no comments", () => {
      return request(app)
        .get("/api/articles/2/comments")
        .expect(200)
        .then(({ body }) => {
          const comments = body.comments;
          expect(comments).toEqual([]);
        });
    });
    test("GET 400: Responds with an error message if passed a bad article ID", () => {
      return request(app)
        .get("/api/articles/NotAnId/comments")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad Request");
        });
    });
    test("GET 404: Responds with an error message if passed an article_id which does not exist", () => {
      return request(app)
        .get("/api/articles/99/comments")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("No article found");
        });
    });
  });
});
describe("POST /api/articles/:article_id/comments", () => {
  test("POST 201 : Responds with a posted comment", () => {
    return request(app)
      .post("/api/articles/2/comments")
      .send({
        username: "butter_bridge",
        body: "git manager",
      })
      .expect(201)
      .then(({ body: commentBody }) => {
        expect(typeof commentBody).toBe("object");
        const { comment_id, body, votes, author, created_at, article_id } =
          commentBody.comment;
        expect(typeof comment_id).toBe("number");
        expect(typeof article_id).toBe("number");
        expect(typeof body).toBe("string");
        expect(typeof votes).toBe("number");
        expect(typeof author).toBe("string");
        expect(typeof created_at).toBe("string");
      });
  });
  test("POST 400: Responds with an error message if passed a bad article_id", () => {
    return request(app)
      .post("/api/articles/NotAnId/comments")
      .send({
        username: "butter_bridge",
        body: "invalid article_id test",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid article_id");
      });
  });
  test("POST 404: Responds with an error message if passed an article_id that is not present", () => {
    return request(app)
      .post("/api/articles/99/comments")
      .send({
        username: "butter_bridge",
        body: "Non-existent article_id test",
      })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("No article found");
      });
  });
  test("POST 400: Responds with an error message if article_id is missing", () => {
    return request(app)
      .post("/api/articles/99/comments")
      .send({
        body: "Missing username test",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Please insert username and body");
      });
  });
  test("POST 400: Responds with an error message if body is missing", () => {
    return request(app)
      .post("/api/articles/99/comments")
      .send({
        article_id: 2,
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Please insert username and body");
      });
  });
});
describe("PATCH /api/articles/:article_id", () => {
  test("PATCH 200: Responds with the updated article with updated votes", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({
        inc_votes: 10,
      })
      .expect(200)
      .then(({ body: articleBody }) => {
        const {
          author,
          title,
          article_id,
          body,
          topic,
          created_at,
          votes,
          article_img_url,
        } = articleBody.article;
        expect(typeof author).toBe("string");
        expect(typeof title).toBe("string");
        expect(typeof article_id).toBe("number");
        expect(typeof body).toBe("string");
        expect(typeof topic).toBe("string");
        expect(typeof created_at).toBe("string");
        expect(typeof votes).toBe("number");
        expect(typeof article_img_url).toBe("string");
      });
  });
  test("PATCH 400: Responds with an error message if inc_votes is not a number", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({
        inc_votes: "NotANumber",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input");
      });
  });
  test("PATCH 400: Responds with an error message if inc_votes is missing", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({})
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input");
      });
  });
  test("PATCH 400: Responds with an error message if article_id is not a number", () => {
    return request(app)
      .patch("/api/articles/notANumber")
      .send({
        inc_votes: 10,
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("PATCH 404: Responds with an error message if article_id does not exist", () => {
    return request(app)
      .patch("/api/articles/999")
      .send({
        inc_votes: 10,
      })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article not found");
      });
  });
});
describe("DELETE /api/comments/:comment_id", () => {
  test("DELETE 204: deletes the comment with the specified comment ID", () => {
    return request(app)
      .delete("/api/comments/1")
      .expect(204)
      .then(({ body }) => {
        expect(body).toEqual({});
      });
  });
  test("DELETE 400: Responds with an error message if comment ID is invalid", () => {
    return request(app)
      .delete("/api/comments/notAnId")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("DELETE 404: Responds with an error message if comment ID does not exist", () => {
    return request(app)
      .delete("/api/comments/999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Comment Not Found");
      });
  });
});
