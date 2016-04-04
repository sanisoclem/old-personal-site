import express = require('express');
import auth = require('../security/authentication')

let authService = auth(process.env.googleClientId,process.env.googleClientSecret);

export = function exposeUserInfo (req:express.Request, res:express.Response, next:express.NextFunction) {
  if (authService.isAuthenticated(req))
    res.locals.user = authService.getCurrentUser(req);
    
  next();
};