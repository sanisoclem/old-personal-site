var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: process.env.siteName,version: req.app.locals.pkgJson.version });
});

module.exports = router;
