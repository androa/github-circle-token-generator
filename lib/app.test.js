const request = require("supertest");
const fs = require("fs");
const { setGitHubTokenOnProject } = require("./set-github-token-on-project");

jest.mock("./set-github-token-on-project");

process.env.GITHUB_APP_ID = "123";
process.env.GITHUB_APP_KEY = fs.readFileSync("__mocks__/github-app-key.pem");

const app = require("./app");

test("token gets added to environment of project", done => {
  setGitHubTokenOnProject.mockResolvedValue({ name: "BAR", value: "xxxFOO" });

  request(app)
    .get("/token/inject?username=test&project=test")
    .expect(({ text }) => {
      console.log(text);
      expect(text).toMatchSnapshot();
    })
    .expect(200, done);
});

test("request fails if username is missing", done => {
  request(app)
    .get("/token/inject?project=test")
    .expect(({ body }) => {
      expect(body).toMatchSnapshot();
    })
    .expect(400, done);
});

test("request fails if project is missing", done => {
  request(app)
    .get("/token/inject?username=test")
    .expect(({ body }) => {
      expect(body).toMatchSnapshot();
    })
    .expect(400, done);
});

test("request fails if username and project is missing", done => {
  request(app)
    .get("/token/inject")
    .expect(({ body }) => {
      expect(body).toMatchSnapshot();
    })
    .expect(400, done);
});
