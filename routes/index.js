var express = require('express');
var refreshToken = require('../middleware/refresh-token-mw');
var accessToken = require('../middleware/access-token-mw');
var userMw = require('../middleware/user-mw');
var userServices = require('../lib/user-services');
var Bus = require('../lib/bus-service');
var bus = new Bus({});

var router = express.Router();

module.exports = function (passport) {
    router.get('/heartbeat', function (req, res) {
        res.send();
    });

    router.get('/account',
        passport.authenticate('access-token', {session: false}),
        function (req, res) {
            var user = req.user;
            res.send({
                id: user.id,
                email: user.local.email,
                memberships: user.memberships
            });
        }
    );

    router.delete('/account',
        passport.authenticate('access-token', {session: false}),
        function (req, res, next) {
            var userId = req.user._id;

            userServices.deleteAccount(userId, function (err) {
                if (err) {
                    return next(err);
                }

                bus.publishDeleteUser({id: userId}, function(err){
                    if (err) {
                        return next(err);
                    }

                    res.send(200);
                });
            });
        });

    // Facebook ----------------------
    router.get('/facebook', passport.authenticate('facebook', {
        failureRedirect: '/',
        scope: ['email']
    }));

    router.get('/facebook/callback', [
        passport.authenticate('facebook', {session: false}),
        refreshToken.create,
        accessToken.create,
        userMw.update
    ], function (req, res) {
        publishSocialAuth(req, function(err){
            if (err) {
                return next(err);
            }

            res.send({
                accessToken: res.locals.accessToken,
                refreshToken: res.locals.refreshToken
            });
        });
    });

    // Twitter ----------------------
    router.get('/twitter', passport.authenticate('twitter', {
        failureRedirect: '/'
    }));

    router.get('/twitter/callback', [
        passport.authenticate('twitter', {session: false}),
        refreshToken.create,
        accessToken.create,
        userMw.update
    ], function (req, res) {
        publishSocialAuth(req, function(err){
            if (err) {
                return next(err);
            }

            res.send({
                accessToken: res.locals.accessToken,
                refreshToken: res.locals.refreshToken
            });
        });
    });

    // Google ----------------------
    router.get('/google', passport.authenticate('google', {
        failureRedirect: '/',
        scope: ['email']
    }));

    router.get('/google/callback', [
        passport.authenticate('google', {session: false}),
        refreshToken.create,
        accessToken.create,
        userMw.update
    ], function (req, res) {
        publishSocialAuth(req, function(err){
            if (err) {
                return next(err);
            }

            res.send({
                accessToken: res.locals.accessToken,
                refreshToken: res.locals.refreshToken
            });
        });
    });

    // Vkontakte ----------------------
    router.get('/vk', passport.authenticate('vkontakte', {
        failureRedirect: '/',
        scope: ['email']
    }));

    router.get('/vk/callback', [
        passport.authenticate('vkontakte', {session: false}),
        refreshToken.create,
        accessToken.create,
        userMw.update
    ], function (req, res) {
        publishSocialAuth(req, function(err){
            if (err) {
                return next(err);
            }

            res.send({
                accessToken: res.locals.accessToken,
                refreshToken: res.locals.refreshToken
            });
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
        bus.publishSignupUser(mapUser(req.user), function(err){
            if (err) {
                return next(err);
            }

            res.status(201);
            res.send({
                accessToken: res.locals.accessToken,
                refreshToken: res.locals.refreshToken
            });
        });
    });

    router.post('/signin', [
        passport.authenticate('local-signin', {session: false}),
        refreshToken.create,
        accessToken.create,
        userMw.update
    ], function (req, res) {
        bus.publishSigninUser(mapUser(req.user), function(err){
            if (err) {
                return next(err);
            }

            res.send({
                accessToken: res.locals.accessToken,
                refreshToken: res.locals.refreshToken
            });
        });
    });

    router.delete('/signout', [
        passport.authenticate('delete-refresh-token', {session: false}),
        refreshToken.remove,
        userMw.update
    ], function (req, res) {
        res.send();
    });

    router.delete('/signoutall', [
        passport.authenticate('delete-all-refresh-token', {session: false}),
        refreshToken.removeAll,
        userMw.update
    ], function (req, res) {
        res.send();
    });

    router.post('/merge', [
        accessToken.verify('token1'),
        accessToken.verify('token2')
    ], function (req, res, next) {
        var toUserId = req.tokens.token1.userId;
        var fromUserId = req.tokens.token2.userId;

        userServices.mergeAccounts(toUserId, fromUserId, function (err) {
            if (err)
                return next(err);

            bus.publishMergeUser({id: toUserId, fromUserId: fromUserId}, function(err){
                if (err) {
                    return next(err);
                }

                res.send();
            });
        });
    });

    router.delete('/unmerge',
        passport.authenticate('access-token', {session: false}),
        function (req, res, next) {
            var userId = req.user.id;
            var provider = req.body.provider;
            var id = req.body.id;

            userServices.unmergeAccount(userId, provider, id, function (err) {
                if (err)
                    return next(err);

                bus.publishUnmergeUser({id: userId, provider: provider, socialId: id}, function(err){
                    if (err) {
                        return next(err);
                    }

                    res.send();
                });
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

function publishSocialAuth(req) {
    var message = {id: req.user._id, membership: req.authData.membership};
    if (req.authData.isNewUser) {
        bus.publishSignupUser(message)
    }
    else {
        bus.publishSigninUser(message);
    }
}
