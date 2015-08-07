module.exports = function (req, res, next) {
    var user = req.user;
    var token = req.token;

    user.refreshTokens = user.refreshTokens || [];

    // remove token
    user.refreshTokens.some(function (item, i, array) {
        if (item.token === token) {
            array.splice(i, 1);
            return true;
        }
        return false;
    });

    next();
};