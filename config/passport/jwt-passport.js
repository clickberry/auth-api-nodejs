var JwtStrategy = require('passport-jwt').Strategy;

var config = require('clickberry-config');
var User = require('../../models/user');

module.exports = function (passport) {
    passport.use('access-token', new JwtStrategy({
        secretOrKey: config.get('token:accessSecret')
    }, function (jwtPayload, done) {
        User.findById(jwtPayload.userId, function (err, user) {
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

    passport.use('refresh-token', new JwtStrategy({
        secretOrKey: config.get('token:refreshSecret'),
        passReqToCallback: true
    }, function (req, jwtPayload, done) {
        User.findById(jwtPayload.userId, function (err, user) {
            if (err) {
                return done(err, false);
            }
            if (user) {
                req.token = jwtPayload.token;
                done(null, user);
            } else {
                done(null, false);
            }
        });
    }));

    passport.use('exchange-token', new JwtStrategy({
        secretOrKey: config.get('token:exchangeSecret'),
        passReqToCallback: true
    }, function (req, jwtPayload, done) {
        User.findById(jwtPayload.userId, function (err, user) {
            if (err) {
                return done(err, false);
            }
            if (user) {
                req.token = jwtPayload.token;
                done(null, user);
            } else {
                done(null, false);
            }
        });
    }));
};