var jwt = require('jsonwebtoken');
var shortid = require('shortid');
var config = require('../config');

module.exports = function (req, res, next) {
    var user = req.user;
    var refreshPayload = createRefreshPayload(user);

    user.refreshTokens = user.refreshTokens || [];


    // delete token if quantity is overflow
    var qRefreshTokens = parseInt(config.get('q_refresh_token')) || 20;
    if (user.refreshTokens.length >= qRefreshTokens) {
        user.refreshTokens.shift();
    }

    // add new token
    user.refreshTokens.push(refreshPayload.token);


    res.locals.refreshToken = createRefreshToken(refreshPayload, 10080);
    next();
};

function createRefreshPayload(user) {
    return {
        token: shortid.generate(),
        userId: user._id
    };
}

function createRefreshToken(payload, expires) {
    return jwt.sign(payload, config.get('refresh_token_secret'), {expiresInMinutes: expires});
}