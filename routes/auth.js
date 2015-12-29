var url = require('url')
var express = require('express');
var google = require('googleapis');

var router = express.Router();
var OAuth2 = google.auth.OAuth2;
var plus = google.plus('v1');

router.post('/login', function(req, res, next) {
    var oauth2Client = new OAuth2(process.env.googleClientId, process.env.googleClientSecret, url.resolve(process.env.siteUrl,'authenticated'));
    if (req.session.user)
        res.redirect('/');
    else
        res.redirect(oauth2Client.generateAuthUrl({
            access_type: 'online', // 'online' (default) or 'offline' (gets refresh_token)
            scope: ['https://www.googleapis.com/auth/plus.me',
            'https://www.googleapis.com/auth/plus.login',
            'https://www.googleapis.com/auth/userinfo.email',
            'https://www.googleapis.com/auth/userinfo.profile']
  }));
});


router.get('/authenticated', function(req, res, next) {
    var oauth2Client = new OAuth2(process.env.googleClientId, process.env.googleClientSecret, url.resolve(process.env.siteUrl,'authenticated'));

    oauth2Client.getToken(req.query.code, function(err, tokens) {
        if (err)
            res.redirect('/authfail');

        oauth2Client.setCredentials(tokens);

        plus.people.get({ userId: 'me', auth: oauth2Client }, function(err, response) {
            // -- save email of current user to session
            req.session.user = response;
            res.render('authenticated', { response: err || JSON.stringify( {response: response,code: req.query.code,token:tokens, cookies: req.cookies} )});
        });
    });
});

router.get('/authfail', function(req, res, next) {
    res.render('authfail', { });
});



module.exports = router;
