const app = require('./lib/app');

const port = process.env.PORT || 3000;

const server = app.listen(port, () => console.log(`Example app listening on port ${port}!`));

process.on('SIGINT', function() {
  server.close(() => {
    process.exit(0);
  });
});
