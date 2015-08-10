var express = require('express');
var checkRefreshToken = require('../middleware/check-refresh-token');
var createAccessToken=require('../middleware/create-access-token');
var deleteRefreshToken=require('../middleware/delete-refresh-token');
var deleteAllRefreshToken=require('../middleware/delete-all-refresh-token');
var createRefreshToken=require('../middleware/create-refresh-token');
var updateUser=require('../middleware/update-user');

var router = express.Router();

function mapUser(user) {
    return {
        id: user._id,
        email: user.local.email
    }
}

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
        checkRefreshToken,
        deleteRefreshToken,
        createRefreshToken,
        createAccessToken,
        updateUser
    ], function (req, res) {
        res.send({
            accessToken: res.locals.accessToken,
            refreshToken: res.locals.refreshToken
        });
    });

    router.post('/signup', [
        passport.authenticate('local-signup', {session: false}),
        createRefreshToken,
        createAccessToken,
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
        createRefreshToken,
        createAccessToken,
        updateUser
    ], function (req, res) {
        res.send({
            accessToken: res.locals.accessToken,
            refreshToken: res.locals.refreshToken
        });
    });

    router.delete('/signout', [
        passport.authenticate('delete-refresh-token', {session: false}),
        deleteRefreshToken,
        updateUser
    ], function (req, res) {
        res.send(200);
    });

    router.delete('/signoutall', [
        passport.authenticate('delete-all-refresh-token', {session: false}),
        deleteAllRefreshToken,
        updateUser
    ], function (req, res) {
        res.send(200);
    });

    return router;
};
