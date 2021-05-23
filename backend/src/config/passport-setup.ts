'use string'
import config from './config'
import passport from 'passport'
import Google from 'passport-google-oauth20'

const GoogleStrategy = Google.Strategy
const GOOGLE_CLIENT_REDIRECT_URL = config.oauth.google.GOOGLE_CLIENT_REDIRECT_URL
const GOOGLE_CLIENT_ID = config.oauth.google.GOOGLE_CLIENT_ID
const GOOGLE_CLIENT_SECRET = config.oauth.google.GOOGLE_CLIENT_SECRET

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((obj, done) => {
    done(null, obj);
});
const passportSetup = () => {
    passport.use(new GoogleStrategy({
            clientID:     GOOGLE_CLIENT_ID,
            clientSecret: GOOGLE_CLIENT_SECRET,
            callbackURL: GOOGLE_CLIENT_REDIRECT_URL
        },
        async (accessToken, refreshToken, profile, done) => {
            const email = profile.emails[0].value;
            return done(null,email)
        }
    ))
}

export default passportSetup