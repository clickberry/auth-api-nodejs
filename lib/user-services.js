var User = require('../models/user');

exports.mergeAccounts = function (toUserId, fromUserId, callback) {
    if (toUserId === fromUserId)
        return callback(new Error('Accounts could not  be merged.'));

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

exports.unmergeAccount = function (userId, provider, id, callback) {
    getUser(userId, function (err, user) {
        if (err)
            return callback(err);

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
    });
};

function getUser(userId, callback) {
    User.findById(userId, function (err, user) {
        if (err)
            return callback(err);

        if (!user)
            return callback(new Error('User not found.'));

        callback(null, user);
    });
};