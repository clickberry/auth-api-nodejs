var mongoose = require('mongoose');
var moment=require('moment');
var bcrypt = require('bcrypt-nodejs')
var config

var userSchema = mongoose.Schema({
    refreshTokens: [String],
    local: {
        email: String,
        password: String
    },
    memberships: [{
        id: String,
        provider: String,
        token: String,
        email: String,
        name: String
    }],
    created: {type: Date, default: moment.utc()}
});

userSchema.methods.generateHash = function (password, callback) {
    hashFromPassword(password, callback);
};

userSchema.methods.validatePassword = function (password, callback) {
    checkPassword.call(this, password, callback);
};

userSchema.statics.createAdmin = function (email, password, callback) {
    var User = this;
    hashFromPassword(password, function (err, hash) {
        User.findOneAndUpdate(
            {
                role: 'admin'},
            {
                role: 'admin',
                local: {
                    email: email,
                    password: hash
                }
            },
            {
                new: true,
                upsert: true,
                setDefaultsOdInsert: true
            }, function(err, admin){
                callback(err, admin);
            });
    });
};

module.exports = mongoose.model('User', userSchema);

function hashFromPassword(password, callback) {
    bcrypt.genSalt(8, function (err, salt) {
        bcrypt.hash(password, salt, null, function (err, hash) {
            callback(err, hash);
        });
    });
}

function checkPassword(password, callback) {
    bcrypt.compare(password, this.local.password, function (err, result) {
        callback(err, result);
    });
}