module.exports = function (req, res, next) {
    var user = req.user;
    user.refreshTokens = [];

    next();
};