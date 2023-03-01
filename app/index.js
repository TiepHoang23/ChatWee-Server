let app = require('./app');
let port = 8000;
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
// app.listen({ port: 4000 }, () => logger.info('🚀 Server ready at http://localhost:4000/graphql '));
