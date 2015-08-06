var LocalStrategy = require('passport-local').Strategy;
var JwtStrategy = require('passport-jwt').Strategy;
var jwt = require('jsonwebtoken');

var config = require('../config');
var User = require('../models/user');

var opts = {}
opts.secretOrKey = config.get('access_token_secret');
//opts.issuer = "accounts.examplesoft.com";
//opts.audience: "yoursite.net";

module.exports = function (passport) {
    passport.use('access-token',
        new JwtStrategy(
            {secretOrKey: config.get('access_token_secret')},
            function (jwtPayload, done) {
                User.findById(jwtPayload.user._id, function (err, user) {
                    if (err) {
                        return done(err, false);
                    }
                    if (user) {
                        done(null, user);
                    } else {
                        done(null, false);
                    }
                });
            }));

    passport.use('refresh-token',
        new JwtStrategy(
            {secretOrKey: config.get('refresh_token_secret')},
            function (jwtPayload, done) {
                User.findById(jwtPayload.id, function (err, user) {
                    if (err) {
                        return done(err, false);
                    }
                    if (user) {
                        done(null, user);
                    } else {
                        done(null, false);
                    }
                });
            }));

    passport.use('local-signup', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    }, function (req, email, password, done) {
        process.nextTick((function () {
            User.findOne({'local.email': email}, function (err, user) {
                if (err)
                    return done(err);

                if (user) {
                    //return done(null, false, req.flash('signupMessage', 'That email is already taken.'))
                    return done(null, false);
                } else {
                    var newUser = new User();
                    newUser.local.email = email;
                    newUser.generateHash(password, function (err, hash) {
                        if (err)
                            return done(err);

                        newUser.local.password = hash;
                        newUser.save(function (err) {
                            if (err)
                                return done(err);

                            return done(null, newUser);
                        });
                    });
                }
            });
        }));
    }));

    passport.use('local-signin', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    }, function (req, email, password, done) {
        User.findOne({'local.email': email}, function (err, user) {
            if (err)
                return done(err);

            if (!user)
            //return done(null, false, req.flash('loginMessage', 'No user found.'));
                return done(null, false);

            user.validatePassword(password, function (err, isValid) {
                if (err)
                    return done(err);

                if (isValid) {
                    done(null, user);
                } else {
                    done(null, false);
                }
            });
        });
    }));
};