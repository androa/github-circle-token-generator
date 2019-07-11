const request = require("supertest");
const fs = require("fs");
const { get, post } = require("axios");
const { setGitHubTokenOnProject } = require("./circleci");

jest.mock("axios");
jest.mock("./circleci");

process.env.GITHUB_APP_ID = "123";
process.env.GITHUB_APP_KEY = fs.readFileSync(
  "./lib/__mocks__/github-app-key.pem"
);

const app = require("./app");

describe("GET /token/inject", () => {
  beforeEach(() => {
    const mockedInstallationResponse = {
      data: [{ id: 123, account: { login: "test" } }]
    };
    const mockedCreateAccessTokenResponse = { data: { token: "xxxFOO" } };

    get.mockResolvedValueOnce(mockedInstallationResponse);
    post.mockResolvedValueOnce(mockedCreateAccessTokenResponse);
  });

  afterEach(() => {
    get.mockReset();
  });

  it("adds token to environment of CircleCI project", done => {
    setGitHubTokenOnProject.mockResolvedValue({ name: "BAR", value: "xxxFOO" });

    request(app)
      .get("/token/inject?owner=test&project=test")
      .expect(({ text }) => {
        expect(text).toMatchSnapshot();
      })
      .expect(200, done);
  });

  it("fails if owner is missing", done => {
    request(app)
      .get("/token/inject?project=test")
      .expect(({ body }) => {
        expect(body).toMatchSnapshot();
      })
      .expect(400, done);
  });

  it("fails if project is missing", done => {
    request(app)
      .get("/token/inject?owner=test")
      .expect(({ body }) => {
        expect(body).toMatchSnapshot();
      })
      .expect(400, done);
  });

  it("fails if owner and project is missing", done => {
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
    get.mockResolvedValueOnce({ data: { id: "123" } });

    request(app)
      .get("/token/verify")
      .expect(({ text }) => {
        expect(text).toMatch(/Successfully created token/);
      })
      .expect(200, done);
  });

  it("verifies that the app returned from GitHub API matches expected", done => {
    get.mockResolvedValueOnce({ data: { id: "321" } });

    request(app)
      .get("/token/verify")
      .expect(500, done);
  });
});
