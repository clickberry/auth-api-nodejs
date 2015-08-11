var FacebookStrategy = require('passport-facebook').Strategy;
var config = require('../index');
var User = require('../../models/user');

module.exports = function (passport) {
    passport.use(new FacebookStrategy({
        clientID: config.get('facebook:clientID'),
        clientSecret: config.get('facebook:clientSecret'),
        callbackURL: config.get('facebook:callbackURL')
    }, function (token, refreshToken, profile, done) {
        User.findOne({'facebook.id': profile.id}, function (err, user) {
            if (err)
                return done(err);

            if (user) {
                return done(null, user);
            } else {
                var newUser = new User();
                newUser.facebook.id = profile.id;
                newUser.facebook.token = token;
                newUser.facebook.name = profile.name.givenName + ' ' + profile.name.familyName;
                newUser.facebook.email = profile && profile.emails && profile.emails[0].value;

                done(null, newUser);
            }
        });
    }))
};