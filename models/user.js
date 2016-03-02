var mongoose = require('mongoose');
var moment = require('moment');
var bcrypt = require('bcrypt-nodejs');
var error = require('clickberry-http-errors');
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
    created: {type: Date, default: moment.utc}
});

userSchema.methods.generateHash = function (password, callback) {
    hashFromPassword(password, callback);
};

userSchema.methods.validatePassword = function (password, passwordHash, callback) {
    checkPassword(password, passwordHash, callback);
};

userSchema.methods.unmergeAccount = function (provider, id, callback) {
    var isUnmerge = false;
    this.memberships.some(function (item, i, array) {
        if (item.provider === provider && item.id === id) {
            array.splice(i, 1);
            isUnmerge = true;
            return true;
        }
        return false;
    });

    if (!isUnmerge) {
        return callback(new error.NotFound());
    }

    this.save(function (err) {
        if (err) {
            return callback(err);
        }

        callback(null);
    });
};

userSchema.statics.createAdmin = function (email, password, callback) {
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

userSchema.statics.mergeAccounts = function (toUserId, fromUserId, callback) {
    if (toUserId === fromUserId)
        return callback(new error.BadRequest('Accounts could not be merged.'));

    getUser(toUserId, function (err, toUser) {
        if (err)
            return callback(err);

        getUser(fromUserId, function (err, fromUser) {
            if (err)
                return callback(err);

            toUser.memberships = toUser.memberships.concat(fromUser.memberships);
            toUser.save(function (err) {
                if (err) {
                    return callback(err);
                }

                fromUser.remove(function (err) {
                    if (err) {
                        return callback(err);
                    }

                    callback(null);
                });
            });
        });
    });
};

var User = module.exports = mongoose.model('User', userSchema);

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

function getUser(userId, callback) {
    User.findById(userId, function (err, user) {
        if (err)
            return callback(err);

        if (!user)
            return callback(new error.NotFound());

        callback(null, user);
    });
}