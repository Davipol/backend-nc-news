# NC News API

A RESTful API for news articles, comments, topics, and users. Built with Node.js, Express, and PostgreSQL — this project powers the backend of a Reddit-style news platform.

- Hosted Version
  View the hosted API here
  https://news-project-p4c3.onrender.com/api

<Project Summary>
NC News is the backend for a full-stack news application. It allows users to:

- Browse news articles by topic

- Sort and order articles by various criteria

- Post comments to articles

- Vote on articles and comments

- View user information

<Technologies>

- Node.js

- Express

- PostgreSQL

- pg-format

- Jest & Supertest (for testing)

- dotenv

<Getting Started>

Follow the instructions below to run the project locally.

1. Clone the Repository

   - git clone https://github.com/Davipol/be-nc-news.git
   - cd be-nc-news

2. Install Dependencies

   - npm install

3. Set Up Environment Variables
   You must create two .env files in the root of the project:

   .env.development:
   PGDATABASE=nc_news

   .env.test:
   PGDATABASE=nc_news_test

| These files are ignored by git and should not be committed. |

4. Setup & Seed Local Databases
   Ensure PostgreSQL is running, then run:

   - npm run setup-dbs
   - npm run seed

This will create both nc_news and nc_news_test databases and seed the development one with data.

5. Run the Server

   - npm run dev

   The server will start on http://localhost:9090 by default. You can view the API documentation at:

http://localhost:9090/api

6. Run Tests

- npm test

  Runs all tests using Jest and Supertest to validate functionality.

Minimum Requirements

- Node.js: v18.x or higher

- PostgreSQL: v12.x or higher
