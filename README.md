# github-circle-token-generator

A very simple application for generating an GitHub App Installation Token and injects into the desired CircleCI project.

It requires an GitHub App with your desired access, and an CircleCI API Token which has access to the desired project(s).

Necessary environment variables that need to be set to run it:

- _GITHUB_APP_ID_ - The GitHub App ID to use
- _GITHUB_APP_KEY_ - A private key associated with the GitHub App
- _CIRCLECI_TOKEN_ - A CircleCI API token with access to the desired project(s)

## Running Locally

```sh
$ git clone https://github.com/androa/github-circle-token-generator # or clone your own fork
$ cd github-circle-token-generator
$ npm install
$ npm start
```

The app should now be running on [localhost:3000](http://localhost:3000/).

## Usage

Add a `job` in your CircleCI workflow that executes:

`curl -sS https://app-instance/token/inject?username=androa&project=github-circle-token-generator`

All subsequent `job` in the workflow will now have a environment variable called `GITHUB_TOKEN` which can be used for interacting with the GitHub API as an App Installation.

The token is by default valid for 3 minutes.
