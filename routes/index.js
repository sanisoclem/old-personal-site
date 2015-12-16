var express = require('express');
var GitkitClient = require('gitkitclient');
var fs = require('fs');

var gitkitClient = new GitkitClient(JSON.parse(fs.readFileSync('conf/google-server-config.json')));
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var authMessage;
  if (req.cookies.gtoken) {
    gitkitClient.verifyGitkitToken(req.cookies.gtoken, function (err, resp) {
      if (err) {
        authMessage= 'Invalid token: ' + err;
      } else {
        authMessage =  'Welcome back! Login token is: ' + JSON.stringify(resp);
      }
    });
  } else {
    authMessage = 'You are not logged in yet.';
  }

  res.render('index', { title: process.env.siteName,version: req.app.locals.pkgJson.version, authMessage:authMessage });
});

module.exports = router;
