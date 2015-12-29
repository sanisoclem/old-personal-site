var express = require('express');
var session = require('express-session');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var auth = require('./routes/auth.js');
var pkgJson = require('./package.json');
var RedisStore = require('connect-redis')(session);

// -- create express application
var app = express();

// -- expose app global vars
app.locals.pkgJson= pkgJson;


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');


// -- static resources
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use('/static', express.static(path.join(__dirname, 'public')));
app.use('/static-lib',express.static(path.join(__dirname, 'lib')));

// -- setup middleware
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());


// -- setup session
app.use(session({
  store: new RedisStore({url:process.env.REDISCLOUD_URL}),
  secret: process.env.sessionSecret,
  resave: false,
  saveUninitialized: false
}));

// -- register routes
app.use(routes);
app.use(auth);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err,
      title: "Error",
      version: req.app.locals.pkgJson.version
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {},
    title: "Error",
    version: req.app.locals.pkgJson.version
  });
});


module.exports = app;
