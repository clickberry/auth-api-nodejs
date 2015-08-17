var jwt = require('jsonwebtoken');
var shortid = require('shortid');
var config = require('../config');

function create(req, res, next) {
    var user = req.user;
    var refreshPayload = createRefreshPayload(user);

    user.refreshTokens = user.refreshTokens || [];

    // delete token if quantity is overflow
    var qRefreshTokens = parseInt(config.get('qRefreshToken')) || 20;
    if (user.refreshTokens.length >= qRefreshTokens) {
        user.refreshTokens.shift();
    }

    // add new token
    user.refreshTokens.push(refreshPayload.token);


    res.locals.refreshToken = createRefreshToken(refreshPayload, 10080);
    next();
}

function check(req, res, next) {
    var user = req.user;
    var token = req.token;

    var isExist = user.refreshTokens.some(function (item) {
        return item === token;
    });

    if (isExist) {
        next();
    } else {
        var err = new Error('Not Authorized');
        err.status = 401;
        next(err);
    }
}

function remove(req, res, next) {
    var user = req.user;
    var token = req.token;

    user.refreshTokens = user.refreshTokens || [];

    // remove token
    user.refreshTokens.some(function (item, i, array) {
        if (item === token) {
            array.splice(i, 1);
            return true;
        }
        return false;
    });

    next();
}

function removeAll(req, res, next) {
    var user = req.user;
    user.refreshTokens = [];

    next();
}

exports.create = create;
exports.check = check;
exports.remove = remove;
exports.removeAll = removeAll;

function createRefreshPayload(user) {
    return {
        token: shortid.generate(),
        userId: user._id
    };
}

function createRefreshToken(payload, expires) {
    return jwt.sign(payload, config.get('token:refreshToken'), {expiresInMinutes: expires});
}