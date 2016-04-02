import url = require('url');
import express = require('express');
import auth = require('../security/authentication');

let router = express.Router();
let authService = auth(process.env.googleClientId,process.env.googleClientSecret);

export = router;

router.post('/login', function(req, res, next) {
    if (authService.isAuthenticated(req)) {
        // -- already authenticated, redirect back to home page
        res.redirect('/');    
    }
    else {
        res.redirect(authService.getAuthenticationUrl(url.resolve(process.env.siteUrl,'authenticated')));
    }
});


router.get('/authenticated', function(req, res, next) {
    authService.tryParseUserInfo(req,url.resolve(process.env.siteUrl,'authenticated'))
        .then((user)=> res.redirect('/'))
        .fail((err)=> res.redirect('/authfail'));
});

router.get('/authfail', function(req, res, next) {
    res.render('authfail');
});