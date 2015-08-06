var express = require('express');
var jwtGenerator = require('../middleware/jwtGenerator');

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

    router.get('/', function (req, res) {
        res.render('index', {title: 'Express'});
    });

    router.get('/refresh', [
            passport.authenticate('refresh-token', {session: false}),
            jwtGenerator],
        function (req, res) {
            res.send({
                accessToken: res.locals.accessToken,
                refreshToken: res.locals.refreshToken
            });
        });

    router.post('/signup', [
            passport.authenticate('local-signup', {session: false}),
            jwtGenerator],
        function (req, res) {
            res.status(201);
            res.send({
                accessToken: res.locals.accessToken,
                refreshToken: res.locals.refreshToken
            });
        });

    router.post('/login', [
            passport.authenticate('local-signin', {session: false}),
            jwtGenerator],
        function (req, res) {
            res.send({
                accessToken: res.locals.accessToken,
                refreshToken: res.locals.refreshToken
            });
        });

    return router;
};
