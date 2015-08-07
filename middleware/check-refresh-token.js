var config = require('../config');

module.exports = function (req, res, next) {
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
};