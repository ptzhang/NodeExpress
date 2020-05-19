const passport = require('passport');
const debug = require('debug')('app:authRoutes');
require('./strategies/local.strategy')();

module.exports = function passportConfig(app) {
    app.use(passport.initialize());
    app.use(passport.session());

    //store user in session
    passport.serializeUser((user, done) => {
        debug('serialise');
        done(null, user)
    });

    //retrieves user from session
    passport.deserializeUser((user, done) => {
        debug('deserialise');
        done(null, user);
    });


}