console.warn('Move user-service logic to ../models/users');

var error = require('clickberry-http-errors');
var User = require('../models/user');

exports.mergeAccounts = function (toUserId, fromUserId, callback) {
    if (toUserId === fromUserId)
        return callback(new Error('Accounts could not be merged.'));

    getUser(toUserId, function (err, toUser) {
        if (err)
            return callback(err);

        getUser(fromUserId, function (err, fromUser) {
            if (err)
                return callback(err);

            toUser.memberships = toUser.memberships.concat(fromUser.memberships);
            fromUser.remove(function (err) {
                if (err)
                    return callback(err);

                toUser.save(function (err) {
                    if (err)
                        return callback(err);

                    callback(null);
                });
            });
        });
    });
};

exports.unmergeAccount = function (user, provider, id, callback) {
    user.memberships.some(function (item, i, array) {
        if (item.provider === provider && item.id === id) {
            array.splice(i);
            return true;
        }
        return false;
    });

    user.save(function (err) {
        if (err)
            return callback(err);

        callback(null);
    });
};

exports.deleteAccount = function (userId, callback) {
    getUser(userId, function (err, user) {
        if (err)
            return callback(err);

        user.remove(function (err) {
            if (err)
                return callback(err);

            callback(null);
        });
    });
};

function getUser(userId, callback) {
    User.findById(userId, function (err, user) {
        if (err)
            return callback(err);

        if (!user)
            return callback(new error.NotFound());

        callback(null, user);
    });
}