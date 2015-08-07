var jwt = require('jsonwebtoken');
var shortid = require('shortid');
var config = require('../config');

module.exports = function (req, res, next) {
    var user = req.user;
    var refreshPayload = createRefreshPayload(user);

    user.refreshTokens = user.refreshTokens || [];

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