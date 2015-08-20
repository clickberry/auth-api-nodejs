var User = require('../models/user');

exports.mergeAccounts = function (toUserId, fromUserId, callback) {
    findUser(toUserId, function (err, toUser) {
        if (err)
            return callback(err);

        findUser(fromUserId, function (err, fromUser) {
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

function findUser(userId, callback) {
    User.findById(userId, function (err, user) {
        if (err)
            return callback(err);

        if (!user)
            return callback(new Error('User not found.'));

        callback(null, user);
    });
};