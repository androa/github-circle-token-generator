const { addEnv: addEnvOnCircleProject } = require("circleci-api");

const circleToken = process.env.CIRCLECI_TOKEN;

const setGitHubTokenOnProject = async (owner, project, token) => {
  const vcs = {
    owner,
    repo: project
  };

  const environmentVariable = {
    name: "GITHUB_TOKEN",
    value: token
  };

  return await addEnvOnCircleProject(circleToken, vcs, environmentVariable);
};

exports.setGitHubTokenOnProject = setGitHubTokenOnProject;
