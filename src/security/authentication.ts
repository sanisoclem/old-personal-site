import express = require('express');
import Q = require('q');
var google = require('googleapis');

var OAuth2 = google.auth.OAuth2;
var plus = google.plus('v1');

export = function GoogleAuthServiceFactory (clientId:string,clientSecret:string) {
    return new GoogleAuthService(clientId,clientSecret);
};

interface IAuthenticationService {
    isAuthenticated(req:express.Request):boolean;
    getAuthenticationUrl(redirectUrl:string):string;
    getCurrentUser(req:express.Request):UserInfo;
    tryParseUserInfo(req:express.Request,redirectUrl:string):Q.Promise<UserInfo>;
}

interface UserInfo {
    uid:string;
    displayName:string;
    email?:string;
    refreshToken?:string;   
}

class GoogleAuthService implements IAuthenticationService {
    static scopes = ['https://www.googleapis.com/auth/plus.me',
            'https://www.googleapis.com/auth/plus.login',
            'https://www.googleapis.com/auth/userinfo.email',
            'https://www.googleapis.com/auth/userinfo.profile'];
    constructor(private clientId:string, private clientSecret:string) { }
    
    isAuthenticated(req:express.Request):boolean{
        return req && req.session && req.session['$authenticated'];
    }
    
    getAuthenticationUrl(redirectUrl:string):string {
        var oauth2Client = new OAuth2(this.clientId,this.clientSecret, redirectUrl);
        return oauth2Client.generateAuthUrl({
            access_type: 'online', 
            scope: GoogleAuthService.scopes });
    }
    
    getCurrentUser(req:express.Request):UserInfo {
        if (!req || !req.session)
            return null;
        return req.session['user'] as UserInfo;
    }
    tryParseUserInfo(req:express.Request,redirectUrl:string):Q.Promise<UserInfo> {
        var oauth2Client = new OAuth2(this.clientId,this.clientSecret, redirectUrl);
        return Q.Promise(function (resolve,reject,notify) {
            oauth2Client.getToken(req.query.code, function(err, tokens) {
                if (err)  reject(err);
                else resolve(tokens);  
            })
        }).then(function(tokens){
            oauth2Client.setCredentials(tokens);

            return Q.Promise<UserInfo>(function(resolve,reject,notify) {
                plus.people.get({ userId: 'me', auth: oauth2Client }, function(err, response) {
                    if (err){
                        reject(err);   
                    }
                    else {
                        let user:UserInfo = {
                            uid: response.id,
                            displayName:response.displayName
                        };
                        if (response.emails && response.emails.length) 
                            user.email = response.emails[0].value;
                            
                        req.session['user'] = user;
                        req.session['$authenticated'] = true;
                        resolve(user);
                    }
               }); 
            });
        });
    }
}

