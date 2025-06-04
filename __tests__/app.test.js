const endpointsJson = require("../endpoints.json");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed.js");
const app = require("../app.js");
const data = require("../db/data/test-data");

/* Set up your test imports here */
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
