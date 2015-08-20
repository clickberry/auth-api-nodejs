var express = require('express');
var refreshToken = require('../middleware/refresh-token-mw');
var accessToken = require('../middleware/access-token-mw');
var userMw = require('../middleware/user-mw');
var userServices = require('../lib/user-services');

var router = express.Router();

module.exports = function (passport) {
    router.get('/heartbeat', function (req, res) {
        res.send();
    });

    router.get('/profile',
        passport.authenticate('access-token', {session: false}),
        function (req, res) {
            var user = mapUser(req.user);
            res.send(user);
        }
    );

    // Facebook ----------------------
    router.get('/auth/facebook', passport.authenticate('facebook', {
        failureRedirect: '/',
        scope: ['email']
    }));

    router.get('/auth/facebook/callback', [
        passport.authenticate('facebook', {session: false}),
        refreshToken.create,
        accessToken.create,
        userMw.update
    ], function (req, res) {
        res.send({
            accessToken: res.locals.accessToken,
            refreshToken: res.locals.refreshToken
        });
    });

    // Twitter ----------------------
    router.get('/auth/twitter', passport.authenticate('twitter', {
        failureRedirect: '/'
    }));

    router.get('/auth/twitter/callback', [
        passport.authenticate('twitter', {session: false}),
        refreshToken.create,
        accessToken.create,
        userMw.update
    ], function (req, res) {
        res.send({
            accessToken: res.locals.accessToken,
            refreshToken: res.locals.refreshToken
        });
    });

    // Google ----------------------
    router.get('/auth/google', passport.authenticate('google', {
        failureRedirect: '/',
        scope: ['email']
    }));

    router.get('/auth/google/callback', [
        passport.authenticate('google', {session: false}),
        refreshToken.create,
        accessToken.create,
        userMw.update
    ], function (req, res) {
        res.send({
            accessToken: res.locals.accessToken,
            refreshToken: res.locals.refreshToken
        });
    });

    // Vkontakte ----------------------
    router.get('/auth/vk', passport.authenticate('vkontakte', {
        failureRedirect: '/',
        scope: ['email']
    }));

    router.get('/auth/vk/callback', [
        passport.authenticate('vkontakte', {session: false}),
        refreshToken.create,
        accessToken.create,
        userMw.update
    ], function (req, res) {
        res.send({
            accessToken: res.locals.accessToken,
            refreshToken: res.locals.refreshToken
        });
    });

    router.get('/refresh', [
        passport.authenticate('refresh-token', {session: false}),
        refreshToken.check,
        refreshToken.remove,
        refreshToken.create,
        accessToken.create,
        userMw.update
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
        userMw.update
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
        userMw.update
    ], function (req, res) {
        res.send({
            accessToken: res.locals.accessToken,
            refreshToken: res.locals.refreshToken
        });
    });

    router.delete('/signout', [
        passport.authenticate('delete-refresh-token', {session: false}),
        refreshToken.remove,
        userMw.update
    ], function (req, res) {
        res.send(200);
    });

    router.delete('/signoutall', [
        passport.authenticate('delete-all-refresh-token', {session: false}),
        refreshToken.removeAll,
        userMw.update
    ], function (req, res) {
        res.send(200);
    });

    router.post('/merge', [
        accessToken.verify('token1'),
        accessToken.verify('token2')
    ], function (req, res, next) {
        userServices.mergeAccounts(req.tokens.token1.userId, req.tokens.token2.userId, function (err) {
            if (err)
                return next(err);

            res.send(200);
        });
    });

    return router;
};

function mapUser(user) {
    return {
        id: user._id,
        email: user.local.email
    };
}
