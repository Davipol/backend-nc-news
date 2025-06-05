const app = require("./app.js");

exports.handleCustomErrors = (err, request, response, next) => {
  if (err.status) {
    response.status(err.status).send({ msg: "There was an error" });
  } else next(err);
};

exports.handlePsqlErrors = (err, request, response, next) => {
  if (err.code === "22P02") {
    response.status(400).send({ msg: "Bad Request" });
  }
};

exports.handleServerErrors = (err, request, response, next) => {
  console.log(err);
  response.status(500).send({ msg: "Internal Server Error" });
};
