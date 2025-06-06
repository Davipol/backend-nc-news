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
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});
describe("GET /api/topics", () => {
  test("200 - Responds with an object with the key of topics and the value of an array of topic objects each with a slug and a description property", () => {
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
  test("200 - Responds with an object with the key of articles and the value of an array of article objects each with properties of: author, title, article_id, topic, created_at, votes, article_img_url, comment_count", () => {
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
describe("GET /api/users", () => {
  test("Responds with an object with the key of users and the value of an array of objects with properties: username, name, avatar_url", () => {
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
  test("Responds with an object with a key of article and the value of an article object with the following properties: author, title, article_id, body, topic, created_at, votes, article_img_url", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body: rows }) => {
        const article = rows.article;
        expect(typeof article).toBe("object");
        const {
          author,
          title,
          article_id,
          body,
          topic,
          created_at,
          votes,
          article_img_url,
        } = article;
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
  test("Status: 400, responds with an error message if passed a bad article ID", () => {
    return request(app)
      .get("/api/articles/notAnId")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Error: Bad Request");
      });
  });
  test("Status: 404, responds with an error message if passed an article ID not present", () => {
    return request(app)
      .get("/api/articles/999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe(`No article found for article_id: 999`);
      });
  });
});
