var jwt = require('jsonwebtoken');
var config = require('../config');

module.exports = function (req, res, next) {
    var accessToken = jwt.sign({user: req.user}, config.get('access_token_secret'),{expiresInSeconds: 20});
    var refreshToken = jwt.sign({id: req.user._id}, config.get('refresh_token_secret'),{expiresInMinutes: 10080});
    res.locals.accessToken = accessToken;
    res.locals.refreshToken= refreshToken;
    next();
};