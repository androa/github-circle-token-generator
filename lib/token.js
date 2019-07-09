const { setGitHubTokenOnProject } = require("./set-github-token-on-project");
const { get } = require("axios");
const { sign } = require("jsonwebtoken");

const { GITHUB_APP_ID, GITHUB_APP_KEY, TOKEN_EXPIRES_IN = "3m" } = process.env;

const generateInstallationToken = () =>
  sign({}, GITHUB_APP_KEY, {
    algorithm: "RS256",
    expiresIn: TOKEN_EXPIRES_IN,
    issuer: GITHUB_APP_ID
  });

const testToken = () => {
  const token = generateInstallationToken();

  console.debug("Testing newly generated installation token.");

  get("https://api.github.com/app", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }).then(() =>
    console.debug("Installation token was successfully accepted by GitHub.")
  );
};

const injectToken = ({ username, project }) => {
  const token = generateInstallationToken();

  console.debug(`Installing token for ${username}/${project}`);

  return setGitHubTokenOnProject(username, project, token);
};

exports.testToken = testToken;
exports.injectToken = injectToken;
