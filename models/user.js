var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs')

var userSchema = mongoose.Schema({
    local: {
        email: String,
        password: String        
    },
    refreshTokens: [String]
});

userSchema.methods.generateHash = function (password, callback) {
    bcrypt.genSalt(8, function (err, salt) {
        bcrypt.hash(password, salt, null, function (err, hash) {
            callback(err, hash);
        });
    });
};

userSchema.methods.validatePassword = function (password, callback) {
    bcrypt.compare(password, this.local.password, function (err, result) {
        callback(err, result);
    });
};

module.exports = mongoose.model('User', userSchema);