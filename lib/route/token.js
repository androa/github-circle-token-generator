const { setGitHubTokenOnProject } = require("../circleci");
const { get } = require("axios");
const { sign } = require("jsonwebtoken");

const { GITHUB_APP_ID, GITHUB_APP_KEY, TOKEN_EXPIRES_IN = "3m" } = process.env;

const generateInstallationToken = () =>
  sign({}, GITHUB_APP_KEY, {
    algorithm: "RS256",
    expiresIn: TOKEN_EXPIRES_IN,
    issuer: GITHUB_APP_ID
  });

const verifyToken = () => {
  const token = generateInstallationToken();

  console.debug("Testing newly generated installation token.");

  return get("https://api.github.com/app", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }).then(({ data: { id } }) => {
    if (id != GITHUB_APP_ID) {
      throw Error("GitHub API returned unexpected data");
    }

    console.debug("Installation token was successfully accepted by GitHub.");

    return { token: `xxxx${token.slice(-4)}` };
  });
};

const injectToken = ({ username, project }) => {
  const token = generateInstallationToken();

  console.debug(`Installing token for ${username}/${project}`);

  return setGitHubTokenOnProject(username, project, token);
};

exports.verifyToken = verifyToken;
exports.injectToken = injectToken;
