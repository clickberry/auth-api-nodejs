var crypto = require('crypto');

function Signature(secret, options) {
    this._secret = secret;
    this._algorithm = options && options.algorithm || 'sha256';
    this._digest = options && options.digest || 'base64';
};

Signature.prototype.sign = function (message) {
    var hmac = crypto.createHmac(this._algorithm, this._secret);
    var hash = hmac.update(message).digest(this._digest);

    return hash;
};

Signature.prototype.verify = function (message, signature) {
    try {
        var hash = this.sign(message)
    } catch (err) {
        return false;
    }

    return hash === signature;
};

module.exports = Signature;

