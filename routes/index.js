var express = require('express');
var config = require('clickberry-config');

var refreshToken = require('../middleware/refresh-token-mw');
var accessToken = require('../middleware/access-token-mw');
var userMw = require('../middleware/user-mw');

var userServices = require('../lib/user-services');
var Bus = require('../lib/bus-service');
var bus = new Bus({
    mode: config.get('node:env'),
    address: config.get('nsqd:address'),
    port: config.getInt('nsqd:port')
});

bus.on('reconnect_failed', function (err) {
    console.log(err);
    process.exit(1);
});

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
                id: user._id,
                role: user.role,
                email: user.local.email,
                memberships: user.memberships,
                created: user.created
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

                bus.publishDeleteUser({id: userId}, function (err) {
                    if (err) {
                        return next(err);
                    }

                    res.send(200);
                });
            });
        });

    router.post('/social',
        function (req, res) {
            var callbackUri = req.body.callbackUri;
            res.cookie('callbackUri', callbackUri, {httpOnly: true});
            res.send();
        }
    );

    // Facebook ----------------------
    router.get('/facebook',
        passport.authenticate('facebook', {
            failureRedirect: '/',
            scope: ['email']
        }));

    router.get('/facebook/callback', [
        passport.authenticate('facebook', {session: false}),
        refreshToken.create,
        accessToken.create,
        userMw.update
    ], function (req, res, next) {

        publishSocialAuth(req, function (err) {
            if (err) {
                return next(err);
            }

            redirectToCallbackUri(req, res);
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
    ], function (req, res, next) {
        publishSocialAuth(req, function (err) {
            if (err) {
                return next(err);
            }

            redirectToCallbackUri(req, res);
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
    ], function (req, res, next) {
        publishSocialAuth(req, function (err) {
            if (err) {
                return next(err);
            }

            redirectToCallbackUri(req, res);
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
    ], function (req, res, next) {
        publishSocialAuth(req, function (err) {
            if (err) {
                return next(err);
            }

            redirectToCallbackUri(req, res);
        });
    });

    router.get('/refresh', [
        passport.authenticate('refresh-token', {session: false}),
        refreshToken.check,
        refreshToken.remove,
        refreshToken.create,
        accessToken.create,
        userMw.update
    ], function (req, res, next) {
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
    ], function (req, res, next) {
        bus.publishSignupUser(mapUser(req.user), function (err) {
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
    ], function (req, res, next) {
        bus.publishSigninUser(mapUser(req.user), function (err) {
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
    ], function (req, res, next) {
        res.send();
    });

    router.delete('/signoutall', [
        passport.authenticate('delete-all-refresh-token', {session: false}),
        refreshToken.removeAll,
        userMw.update
    ], function (req, res, next) {
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

            bus.publishMergeUser({id: toUserId, fromUserId: fromUserId}, function (err) {
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

            userServices.unmergeAccount(user, provider, id, function (err) {
                if (err)
                    return next(err);

                bus.publishUnmergeUser({id: userId, provider: provider, socialId: id}, function (err) {
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
        role: user.role,
        email: user.local.email,
        created: user.created
    };
}

function publishSocialAuth(req, callback) {
    var message = {id: req.user._id, membership: req.authData.membership};
    if (req.authData.isNewUser) {
        bus.publishSignupUser(message, function (err) {
            if (err) {
                return callback(err);
            }

            callback()
        });
    }
    else {
        bus.publishSigninUser(message, function (err) {
            if (err) {
                return callback(err);
            }

            callback()
        });
    }
}

function redirectToCallbackUri(req, res) {
    var callbackUri = (req.cookies && req.cookies.callbackUri) || '/';
    var refreshToken = res.locals.refreshToken;
    var accessToken = res.locals.accessToken;

    var query = '?refresh_token=' + refreshToken + '&access_token=' + accessToken;

    res.redirect(301, callbackUri + query);
}