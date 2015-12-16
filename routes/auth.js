var url = require('url')
var express = require('express');
var GitkitClient = require('gitkitclient');
var fs = require('fs');

var gitkitClient = new GitkitClient(JSON.parse(fs.readFileSync('conf/google-server-config.json')));
var router = express.Router();

router.all('/login', function(req, res, next) {
    res.render('login', { postBody : encodeURIComponent(req.body || '') });
});

router.post('/sendemail', function (req, res) {
    req.app.disable('etag');
    gitkitClient.getOobResult(req.body, req.ip, req.cookies.gtoken, function(err, resp) {
        if (err) {
            console.log('Error: ' + JSON.stringify(err));
        } else {
            // Add code here to send email
            console.log('Send email: ' + JSON.stringify(resp));
        }
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        res.end(resp.responseBody);
    })
});



module.exports = router;
