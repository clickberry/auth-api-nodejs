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
        getUser(profile, token, function (err, user) {
            done(err, user);
        });
    }));

    passport.use(new TwitterStrategy({
        consumerKey: config.get('twitter:consumerKey'),
        consumerSecret: config.get('twitter:consumerSecret'),
        callbackURL: config.getUrl('twitter:callbackURL')
    }, function (token, refreshToken, profile, done) {
        getUser(profile, token, function (err, user) {
            done(err, user);
        });
    }));

    passport.use(new GoogleStrategy({
            clientID: config.get('google:clientID'),
            clientSecret: config.get('google:clientSecret'),
            callbackURL: config.getUrl('google:callbackURL')
        },
        function (token, tokenSecret, profile, done) {
            getUser(profile, token, function (err, user) {
                done(err, user);
            });
        }
    ));

    passport.use(new VKontakteStrategy({
            clientID: config.get('vk:clientID'),
            clientSecret: config.get('vk:clientSecret'),
            callbackURL: config.getUrl('vk:callbackURL')
        },
        function (token, tokenSecret, profile, done) {
            getUser(profile, token, function (err, user) {
                done(err, user);
            });
        }
    ));

    function getUser(profile, token, callback) {
        User.findOne({'memberships.id': profile.id, 'memberships.provider': profile.provider}, function (err, user) {
            if (err) {
                callback(err);
            }

            if (!user) {
                user = createUser(profile, token);
            }

            callback(err, user);
        });
    }

    function createUser(profile, token) {
        var newUser = new User();

        var membership = {
            id: profile.id,
            provider: profile.provider,
            token: token,
            name: profile.displayName,
            email: profile.emails && profile.emails[0].value
        };

        newUser.memberships.push(membership);

        return newUser;
    }
};