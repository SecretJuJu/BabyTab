'use string';
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("./config"));
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth_jwt_1 = __importDefault(require("passport-google-oauth-jwt"));
const GoogleStrategy = passport_google_oauth_jwt_1.default.GoogleOauthJWTStrategy;
const GOOGLE_CLIENT_REDIRECT_URL = config_1.default.oauth.google.GOOGLE_CLIENT_REDIRECT_URL;
const GOOGLE_CLIENT_ID = config_1.default.oauth.google.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = config_1.default.oauth.google.GOOGLE_CLIENT_SECRET;
passport_1.default.serializeUser((user, done) => {
    done(null, user);
});
passport_1.default.deserializeUser((obj, done) => {
    done(null, obj);
});
const strategies = () => {
    passport_1.default.use(new GoogleStrategy({
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: GOOGLE_CLIENT_REDIRECT_URL
    }, function verify(accessToken, loginInfo, refreshToken, done) {
        // User.findOrCreate({
        //     googleEmail: loginInfo.email
        // }, function (err, user) {
        //     return done(err, user);
        // });
        return done(null, loginInfo);
    }));
};
exports.default = strategies;
//# sourceMappingURL=passport.js.map