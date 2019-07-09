const { addEnv } = require("circleci-api");
const { setGitHubTokenOnProject } = require("./circleci");

jest.mock("circleci-api");

test("token gets added to environment of project", done => {
  addEnv.mockResolvedValue({ data: true });
  setGitHubTokenOnProject("user", "project", "token").then(() => done());
});

test("token missing username or project throws error", done => {
  addEnv.mockRejectedValue({ error: true });
  setGitHubTokenOnProject("project", "token").catch(() => done());
});
