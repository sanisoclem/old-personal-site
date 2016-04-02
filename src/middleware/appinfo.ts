import express = require('express');

export = function  (req:express.Request, res:express.Response, next:express.NextFunction) {
  res.locals.appName =  process.env.siteName;
  res.locals.appVersion = req.app.locals.pkgJson.version;
  next();
};