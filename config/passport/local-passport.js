var LocalStrategy = require('passport-local').Strategy;
var User = require('../../models/user');

module.exports = function (passport) {
    passport.use('local-signup', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    }, function (req, email, password, done) {
        email = email.toLowerCase();
        User.findOne({'memberships.provider': 'email', 'memberships.id': email}, function (err, user) {
            if (err)
                return done(err);

            if (user) {
                return done(null, false);
            } else {
                var newUser = new User();
                newUser.generateHash(password, function (err, hash) {
                    if (err) {
                        return done(err);
                    }

                    var membership = {
                        id: email,
                        provider: 'email',
                        email: email,
                        password: hash
                    };
                    newUser.role = 'user';
                    newUser.memberships.push(membership);

                    newUser.save(function (err) {
                        if (err) {
                            return done(err);
                        }

                        req.authData = {
                            membership: membership,
                            isNewUser: true
                        };
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
        User.findOne(
            {
                memberships: {
                    $elemMatch: {
                        provider: 'email',
                        id: email
                    }
                }
            },
            {
                role: 1,
                created: 1,
                refreshTokens: 1,
                'memberships.$': 1
            }, function (err, user) {
                if (err)
                    return done(err);

                if (!user) {
                    return done(null, false);
                }

                var membership = user.memberships[0];
                user.validatePassword(password, membership.password, function (err, isValid) {
                    if (err)
                        return done(err);

                    if (isValid) {
                        req.authData = {
                            membership: membership,
                            isNewUser: true
                        };
                        done(null, user);
                    } else {
                        done(null, false);
                    }
                });
            });
    }));
};