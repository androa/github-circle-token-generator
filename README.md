# github-circle-token-generator

A very simple application for generating an GitHub App Installation Token and injects into the desired CircleCI project.

It requires an GitHub App with your desired access level, and an CircleCI API Token which has access to the desired project(s).

Necessary environment variables that need to be set to run it:

- **GITHUB_APP_ID** - The GitHub App ID to use
- **GITHUB_APP_KEY** - A private key associated with the GitHub App
- **CIRCLECI_TOKEN** - A CircleCI API token with access to the desired project(s)
- **TOKEN_EXPIRES_IN** - _(optional)_ How long the token should be valid (default: 3m)

## Running Locally

```sh
$ git clone https://github.com/androa/github-circle-token-generator
$ cd github-circle-token-generator
$ npm install
$ npm start
```

The app should now be running on [localhost:3000](http://localhost:3000/).

## Usage

Add a `job` in your CircleCI workflow that executes:

`curl -sS https://app-instance/token/inject?owner=$CIRCLE_PROJECT_USERNAME&project=$CIRCLE_PROJECT_REPONAME`

All subsequent `job` in the workflow will now have a environment variable called `GITHUB_TOKEN` which can be used for interacting with the GitHub API as an App Installation.

The token is by default valid for 3 minutes.
