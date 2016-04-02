import express = require('express');

let router = express.Router();
export = router;

router.get('/', function(req, res, next) {
    let authMessage = 'You are not logged in yet.';
    res.render('index', { title: process.env.siteName,version: req.app.locals.pkgJson.version, authMessage:authMessage });
});
