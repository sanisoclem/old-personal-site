import express = require('express');

let router = express.Router();
export = router;

router.get('/', function(req, res, next) {
    res.render('index',{layout:null});
});
