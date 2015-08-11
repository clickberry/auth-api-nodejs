var express = require('express');
var refreshToken = require('../middleware/refresh-token-mw');
var accessToken = require('../middleware/access-token-mw');
var updateUser = require('../middleware/update-user-mw');

var router = express.Router();

module.exports = function (passport) {
    router.get('/profile',
        passport.authenticate('access-token', {session: false}),
        function (req, res) {
            var user = mapUser(req.user);
            res.send(user);
        }
    );

    router.get('/refresh', [
        passport.authenticate('refresh-token', {session: false}),
        refreshToken.check,
        refreshToken.remove,
        refreshToken.create,
        accessToken.create,
        updateUser
    ], function (req, res) {
        res.send({
            accessToken: res.locals.accessToken,
            refreshToken: res.locals.refreshToken
        });
    });

    router.post('/signup', [
        passport.authenticate('local-signup', {session: false}),
        refreshToken.create,
        accessToken.create,
        updateUser
    ], function (req, res) {
        res.status(201);
        res.send({
            accessToken: res.locals.accessToken,
            refreshToken: res.locals.refreshToken
        });
    });

    router.post('/signin', [
        passport.authenticate('local-signin', {session: false}),
        refreshToken.create,
        accessToken.create,
        updateUser
    ], function (req, res) {
        res.send({
            accessToken: res.locals.accessToken,
            refreshToken: res.locals.refreshToken
        });
    });

    router.delete('/signout', [
        passport.authenticate('delete-refresh-token', {session: false}),
        refreshToken.remove,
        updateUser
    ], function (req, res) {
        res.send(200);
    });

    router.delete('/signoutall', [
        passport.authenticate('delete-all-refresh-token', {session: false}),
        refreshToken.removeAll,
        updateUser
    ], function (req, res) {
        res.send(200);
    });

    return router;
};

function mapUser(user) {
    return {
        id: user._id,
        email: user.local.email
    }
}
