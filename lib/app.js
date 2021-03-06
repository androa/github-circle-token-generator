const express = require("express");
const { buildCheckFunction, validationResult } = require("express-validator");
const { verifyToken, injectToken } = require("./route/token");

const app = express();
const check = buildCheckFunction(["query"]);

app.get("/token/verify", (_req, res, next) => {
  verifyToken()
    .then(({ token }) => {
      res
        .status(200)
        .send(
          `Successfully created token (ending with ${token}) and verified it against the GitHub API.`
        );
    })
    .catch(next);
});

app.get(
  "/token/inject",
  [
    check("owner", "Owner is required")
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
      return res.status(400).send({ errors: errors.array() });
    }

    const { owner, project } = req.query;

    injectToken({ owner, project })
      .then(({ value }) =>
        res
          .status(200)
          .send(
            `Successfully created token (ending with ${value}) and injected it to CircleCI build (${owner}/${project})`
          )
      )
      .catch(next);
  }
);

module.exports = app;
