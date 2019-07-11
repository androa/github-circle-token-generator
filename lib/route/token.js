const { setGitHubTokenOnProject } = require("../circleci");
const { get, post } = require("axios");
const { sign } = require("jsonwebtoken");

const { GITHUB_APP_ID, GITHUB_APP_KEY, TOKEN_EXPIRES_IN = "3m" } = process.env;

const verifyToken = async () => {
  const token = generateApplicationToken();

  console.debug("Testing newly generated application token.");

  const appMeta = await get("https://api.github.com/app", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (appMeta.data.id != GITHUB_APP_ID) {
    throw Error("GitHub API returned unexpected data");
  }

  console.debug("Application token was successfully accepted by GitHub.");

  return { token: `xxxx${token.slice(-4)}` };
};

const injectToken = async ({ owner, project }) => {
  const token = await generateInstallationToken(owner);

  console.debug(`Installing token for ${owner}/${project}`);

  return setGitHubTokenOnProject(owner, project, token);
};

const generateInstallationToken = async owner => {
  const appToken = generateApplicationToken();

  const { data: installations } = await get(
    "https://api.github.com/app/installations",
    { headers: getHeaders(appToken) }
  );

  const installationId = installations.find(
    installation => installation.account.login == owner
  ).id;

  const {
    data: { token: accessToken }
  } = await post(
    `https://api.github.com/app/installations/${installationId}/access_tokens`,
    {
      permissions: {
        deployments: "write"
      }
    },
    { headers: getHeaders(appToken) }
  );

  return accessToken;
};

const generateApplicationToken = () =>
  sign({}, GITHUB_APP_KEY, {
    algorithm: "RS256",
    expiresIn: TOKEN_EXPIRES_IN,
    issuer: GITHUB_APP_ID
  });

const getHeaders = appToken => ({
  Authorization: `Bearer ${appToken}`,
  Accept: "application/vnd.github.machine-man-preview+json"
});

exports.verifyToken = verifyToken;
exports.injectToken = injectToken;
