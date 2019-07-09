const axios = require("axios");
const CircleCi = require("circleci");
const express = require("express");
const fs = require("fs");
const jwt = require("jsonwebtoken");

const app = express();
const port = process.env.PORT || 3000;
const APP_ID = process.env.GITHUB_APP_ID;
const privateKey = process.env.GITHUB_APP_KEY;
const circleToken = process.env.CIRCLECI_TOKEN;
const ci = new CircleCi({
  auth: circleToken
});

const token = (req, res) => {
  var token = jwt.sign({}, privateKey, {
    algorithm: "RS256",
    expiresIn: "3m",
    issuer: APP_ID
  });

  return token;
};

app.get("/test-token", (req, res) => {
  const tokens = token();

  console.log(`Made new token ${tokens}`);

  axios
    .get("https://api.github.com/app", {
      headers: {
        Authorization: `Bearer ${tokens}`
      }
    })
    .then(({ data }) => res.send)
    .catch(l => {
      console.log(l);
      res.send(l);
    });
});

app.get("/inject-token", (req, res) => {
  const tokens = token();

  console.log(`Made new token ${tokens}`);

  const request = {
    username: req.query.username,
    project: req.query.project,
    body: {
      name: "GITHUB_TOKEN",
      value: tokens
    }
  };

  console.log(`Installing token for ${request.username}/${request.project}`);

  ci.setEnvVar(request)
    .then(f => {
      console.log(f);
      res.send(f);
    })
    .catch(res.send);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
