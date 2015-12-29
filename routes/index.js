var express = require('express');

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var authMessage;
  if (req.session.user) {
    authMessage = JSON.stringify(req.session.user);
  } else {
    authMessage = 'You are not logged in yet.';
  }

  res.render('index', { title: process.env.siteName,version: req.app.locals.pkgJson.version, authMessage:authMessage });
});

module.exports = router;
