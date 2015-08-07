var jwt = require('jsonwebtoken');
var config = require('../config');

module.exports = function (req, res, next) {
    var user = req.user;
    var accessPayload = createAccessPayload(user);

    res.locals.accessToken = createAccessToken(accessPayload, 20);
    next();
};

function createAccessPayload(user) {
    return {
        userId: user._id
    };
}

function createAccessToken(payload, expires) {
    return jwt.sign(payload, config.get('access_token_secret'), {expiresInSeconds: expires});
}