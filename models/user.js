var mongoose = require('mongoose');
var moment = require('moment');
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    role: String,
    refreshTokens: [String],
    memberships: [new Schema({
        id: String,
        provider: String,
        token: String,
        email: String,
        name: String,
        password: String
    }, {_id: false})],
    created: {type: Date, default: moment.utc()}
});

userSchema.methods.generateHash = function (password, callback) {
    hashFromPassword(password, callback);
};

userSchema.methods.validatePassword = function (password, passwordHash, callback) {
    checkPassword(password, passwordHash, callback);
};

userSchema.statics.createAdmin = function (email, password, callback) {
    var User = this;
    hashFromPassword(password, function (err, hash) {
        User.findOneAndUpdate(
            {
                role: 'admin'
            },
            {
                role: 'admin',
                memberships: [{
                    id: email,
                    provider: 'email',
                    email: email,
                    password: hash
                }]
            },
            {
                new: true,
                upsert: true,
                setDefaultsOnInsert: true
            }, function (err, admin) {
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

function checkPassword(password, passwordHash, callback) {
    bcrypt.compare(password, passwordHash, function (err, result) {
        callback(err, result);
    });
}