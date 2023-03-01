let createError = require('http-errors');
let express = require('express');
let cookieParser = require('cookie-parser');
const auth = require('./middleware/auth');
// let redisClient = require('./database/redis');
const { createServer } = require('http');
let { attachRouter } = require('./routes');
const { io } = require('./socket');
const app = express();
const httpServer = createServer(app);
io.attach(httpServer);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cookieParser());

attachRouter(app);
// catch 404 and forward to error handler

app.use(function (req, res, next) {
  res.send('404 not found');
});

// // error handler
// app.use(function (err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

module.exports = httpServer;
