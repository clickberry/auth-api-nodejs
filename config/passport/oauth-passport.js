var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var VKontakteStrategy = require('passport-vkontakte').Strategy;

var config = require('../index');
var User = require('../../models/user');

module.exports = function (passport) {
    passport.use(new FacebookStrategy({
        clientID: config.get('facebook:clientID'),
        clientSecret: config.get('facebook:clientSecret'),
        callbackURL: config.getUrl('facebook:callbackURL')
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
                newUser.facebook.name = profile.displayName;
                newUser.facebook.email = profile.emails && profile.emails[0].value;

                done(null, newUser);
            }
        });
    }));

    passport.use(new TwitterStrategy({
        consumerKey: config.get('twitter:consumerKey'),
        consumerSecret: config.get('twitter:consumerSecret'),
        callbackURL: config.getUrl('twitter:callbackURL')
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

    passport.use(new GoogleStrategy({
            clientID: config.get('google:clientID'),
            clientSecret: config.get('google:clientSecret'),
            callbackURL: config.getUrl('google:callbackURL')
        },
        function(token, tokenSecret, profile, done) {
            User.findOne({'google.id': profile.id}, function (err, user) {
                if (err)
                    return done(err);

                if (user) {
                    return done(null, user);
                } else {
                    var newUser = new User();
                    newUser.google.id = profile.id;
                    newUser.google.token = token;
                    newUser.google.name = profile.displayName;
                    newUser.google.email = profile.emails && profile.emails[0].value;

                    done(null, newUser);
                }
            });
        }
    ));

    passport.use(new VKontakteStrategy({
            clientID: config.get('vk:clientID'),
            clientSecret: config.get('vk:clientSecret'),
            callbackURL: config.getUrl('vk:callbackURL')
        },
        function(token, tokenSecret, profile, done) {
            User.findOne({'vk.id': profile.id}, function (err, user) {
                if (err)
                    return done(err);

                if (user) {
                    return done(null, user);
                } else {
                    var newUser = new User();
                    newUser.vk.id = profile.id;
                    newUser.vk.token = token;
                    newUser.vk.name = profile.displayName;

                    done(null, newUser);
                }
            });
        }
    ));
};