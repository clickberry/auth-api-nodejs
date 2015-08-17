var jwt = require('jsonwebtoken');
var config = require('../config');

exports.create = function (req, res, next) {
    var user = req.user;
    var accessPayload = createAccessPayload(user);

    res.locals.accessToken = createAccessToken(accessPayload);
    next();
};

function createAccessPayload(user) {
    return {
        userId: user._id
    };
}

function createAccessToken(payload) {
    var accessSecret = config.get("token:accessSecret");
    var accessTimeout = config.getInt("token:accessTimeout");
    return jwt.sign(payload, accessSecret, {expiresInSeconds: accessTimeout});
}