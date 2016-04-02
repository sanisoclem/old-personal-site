import express = require('express');
import path = require('path');
import requestLogger = require('morgan');
import cookieParser = require('cookie-parser');
import bodyParser = require('body-parser');
import session = require('express-session');
var RedisStore = require('connect-redis')(session);

import routes = require('./routes/index');
import auth = require('./routes/auth');
var pkgJson = require('../package.json');


// -- create express application
var app = express();

export = app;

// -- expose app global vars
app.locals.pkgJson = pkgJson;

// view engine setup
app.set('views', path.join(__dirname, '../views')); // -- set view path
app.set('view engine', 'hbs'); // -- use handlebars


// -- static resources
app.use('/static', express.static(path.join(__dirname, '../static')));

// -- setup middleware
app.use(requestLogger('dev'));
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

// catch everything else turn into 404 errors
app.use(function(req, res, next) {
  let err:any = new Error('Not Found');
  err.status = 404;
  next(err);
});


if (app.get('env') === 'development') {
    // development error handler
    app.use(function(err:any, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err,
            title: "Error",
            version: req.app.locals.pkgJson.version
        });
    });
} 
else 
{
    // production error handler
    app.use(function(err:any, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: {},
            title: "Error",
            version: req.app.locals.pkgJson.version
        });
    });    
}