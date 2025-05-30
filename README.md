# NC News Seeding

- In order to connect to the database locally you'll need to create two environment variable files:
  1. .env.development
     - PGDATABASE=nc_news
  2. .env.test
     - PGDATABASE=nc_news_test
- These files should be placed in the root of the project directory
- The .env.\* files are included in .gitignore by default.
