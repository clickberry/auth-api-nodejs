var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
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
    }));

    passport.use(new TwitterStrategy({
        consumerKey: config.get('twitter:consumerKey'),
        consumerSecret: config.get('twitter:consumerSecret'),
        callbackURL: config.get('twitter:callbackURL')
    }, function (token, refreshToken, profile, done) {
        User.findOne({'twitter.id': profile.id}, function (err, user) {
            if (err)
                return done(err);

            if (user) {
                return done(null, user);
            } else {
                var newUser = new User();
                newUser.twitter.id = profile.id;
                newUser.twitter.token = token;
                newUser.twitter.userName = profile.username;
                newUser.twitter.displayName = profile.displayName;

                done(null, newUser);
            }
        });
    }));

    //passport.serializeUser(function (user, done) {
    //    done(null, user.id);
    //});
    //
    //passport.deserializeUser(function (id, done) {
    //    User.findById(id, function (err, user) {
    //        done(err, user);
    //    });
    //});
};