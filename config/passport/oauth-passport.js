var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var VKontakteStrategy = require('passport-vkontakte').Strategy;
var moment = require('moment');

var config = require('clickberry-config');
var User = require('../../models/user');

module.exports = function (passport) {
    passport.use(new FacebookStrategy({
        clientID: config.get('facebook:clientID'),
        clientSecret: config.get('facebook:clientSecret'),
        callbackURL: config.getUrl('facebook:callbackURL'),
        passReqToCallback: true
    }, function (req, token, refreshToken, profile, done) {
        getUser(profile, token, function (err, user, authData) {
            req.authData = authData;
            done(err, user);
        });
    }));

    passport.use(new TwitterStrategy({
        consumerKey: config.get('twitter:consumerKey'),
        consumerSecret: config.get('twitter:consumerSecret'),
        callbackURL: config.getUrl('twitter:callbackURL'),
        passReqToCallback: true
    }, function (req, token, refreshToken, profile, done) {
        getUser(profile, token, function (err, user, authData) {
            req.authData = authData;
            done(err, user);
        });
    }));

    passport.use(new GoogleStrategy({
            clientID: config.get('google:clientID'),
            clientSecret: config.get('google:clientSecret'),
            callbackURL: config.getUrl('google:callbackURL'),
            passReqToCallback: true
        },
        function (req, token, tokenSecret, profile, done) {
            getUser(profile, token, function (err, user, authData) {
                req.authData = authData;
                done(err, user);
            });
        }
    ));

    passport.use(new VKontakteStrategy({
            clientID: config.get('vk:clientID'),
            clientSecret: config.get('vk:clientSecret'),
            callbackURL: config.getUrl('vk:callbackURL'),
            passReqToCallback: true
        },
        function (req, token, tokenSecret, profile, done) {
            getUser(profile, token, function (err, user, authData) {
                req.authData = authData;
                done(err, user);
            });
        }
    ));

    function getUser(profile, token, callback) {
        User.findOne({'memberships.provider': profile.provider, 'memberships.id': profile.id}, function (err, user) {
            if (err) {
                callback(err);
            }

            var authData = {};
            var membership = authData.membership = createMembership(profile, token);
            authData.isNewUser = false;

            if (!user) {
                user = createUser(membership);
                authData.isNewUser = true;
            }

            callback(err, user, authData);
        });
    }

    function createUser(membership) {
        var newUser = new User();
        newUser.role = 'user';
        newUser.memberships.push(membership);

        return newUser;
    }

    function createMembership(profile, token) {
        var membership = {
            id: profile.id,
            provider: profile.provider,
            token: token,
            name: profile.displayName,
            email: profile.emails && profile.emails[0].value
        };
        return membership;
    }
};