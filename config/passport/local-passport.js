var LocalStrategy = require('passport-local').Strategy;
var moment = require('moment');

var config = require('clickberry-config');
var User = require('../../models/user');

module.exports = function (passport) {
    passport.use('local-signup', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    }, function (req, email, password, done) {
        email = email.toLowerCase();
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

    passport.use('local-signin', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    }, function (req, email, password, done) {
        email = email.toLowerCase();
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