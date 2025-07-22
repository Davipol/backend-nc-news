const db = require("../db/connection.js");

const selectUsers = () => {
  const queryString = `SELECT * FROM users;`;
  return db.query(queryString).then(({ rows }) => {
    return rows;
  });
};

const checkUserExists = (username) => {
  return db
    .query("SELECT * FROM users WHERE username = $1", [username])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "User not found" });
      }
    });
};

module.exports = { selectUsers, checkUserExists };
