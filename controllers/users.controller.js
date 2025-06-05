const seed = require("../db/seeds/seed.js");
const { selectUsers } = require("../models/users.model");
const {
  handleServerErrors,
  handleCustomErrors,
  handlePsqlErrors,
} = require("../errors.js");

const getUsers = (request, response, next) => {
  selectUsers()
    .then((users) => {
      response.status(200).send({ users: users });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = { getUsers };
