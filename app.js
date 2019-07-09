const { testToken, injectToken } = require("./token");
const express = require("express");
const { buildCheckFunction, validationResult } = require("express-validator");

const app = express();
const check = buildCheckFunction(["query"]);

app.get("/token/verify", (_req, res, next) => {
  testToken()
    .then(res.send(200))
    .catch(next);
});

app.get(
  "/token/inject",
  [
    check("username", "Username is required")
      .not()
      .isEmpty()
      .trim()
      .escape(),
    check("project", "Project identifier is required")
      .not()
      .isEmpty()
      .trim()
      .escape()
  ],
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, project } = req.query;

    injectToken({ username, project })
      .then(token =>
        res.send(
          200,
          `Successfully created token (ending with ${
            token.value
          }) and injected it to CircleCI build (${username}/${project})`
        )
      )
      .catch(next);
  }
);

module.exports = app;
