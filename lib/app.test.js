const request = require("supertest");
const fs = require("fs");
const { get } = require("axios");
const { setGitHubTokenOnProject } = require("./circleci");

jest.mock("axios");
jest.mock("./circleci");

process.env.GITHUB_APP_ID = "123";
process.env.GITHUB_APP_KEY = fs.readFileSync(
  "./lib/__mocks__/github-app-key.pem"
);

const app = require("./app");

describe("GET /token/inject", () => {
  it("adds token to environment of CircleCI project", done => {
    setGitHubTokenOnProject.mockResolvedValue({ name: "BAR", value: "xxxFOO" });

    request(app)
      .get("/token/inject?username=test&project=test")
      .expect(({ text }) => {
        expect(text).toMatchSnapshot();
      })
      .expect(200, done);
  });

  it("fails if username is missing", done => {
    request(app)
      .get("/token/inject?project=test")
      .expect(({ body }) => {
        expect(body).toMatchSnapshot();
      })
      .expect(400, done);
  });

  it("fails if project is missing", done => {
    request(app)
      .get("/token/inject?username=test")
      .expect(({ body }) => {
        expect(body).toMatchSnapshot();
      })
      .expect(400, done);
  });

  it("fails if username and project is missing", done => {
    request(app)
      .get("/token/inject")
      .expect(({ body }) => {
        expect(body).toMatchSnapshot();
      })
      .expect(400, done);
  });
});

describe("GET /token/verify", () => {
  it("tests the token generation against the GitHub API", done => {
    get.mockResolvedValue({ data: { id: "123" } });

    request(app)
      .get("/token/verify")
      .expect(({ text }) => {
        //expect(text).toMatchSnapshot();
      })
      .expect(200, done);
  });
});
