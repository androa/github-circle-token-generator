const express = require("express");
const app = require("./lib/app");
const morgan = require("morgan");
const logger = require("./lib/logger");

// Kill express.js default error logger, but keep error handling
console.error = () => {};

const port = process.env.PORT || 3000;
const server = express()
  .use(morgan("combined", { stream: logger.stream }))
  .use(app)
  .use(logger.logErrors)
  .listen(port, () => logger.info(`Example app listening on port ${port}!`));

process.on("SIGINT", function() {
  server.close(() => {
    process.exit(0);
  });
});
