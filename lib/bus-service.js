"use strict";

var util = require('util');
var Publisher = require('clickberry-nsq-publisher');

function Bus(options) {
    Publisher.call(this, options);
}

util.inherits(Bus, Publisher);

Bus.prototype.publishSignupUser = function (user, callback) {
    if (!callback) {
        callback = function () {
        }
    }

    this.publish('registrations', user, function (err) {
        if (err) return callback(err);
        callback();
    });
};

Bus.prototype.publishSigninUser = function (user, callback) {
    if (!callback) {
        callback = function () {
        }
    }

    this.publish('logins', user, function (err) {
        if (err) return callback(err);
        callback();
    });
};

Bus.prototype.publishMergeUser = function (message, callback) {
    if (!callback) {
        callback = function () {
        }
    }

    this.publish('account-merges', message, function (err) {
        if (err) return callback(err);
        callback();
    });
};

Bus.prototype.publishUnmergeUser = function (message, callback) {
    if (!callback) {
        callback = function () {
        }
    }

    this.publish('account-unmerges', message, function (err) {
        if (err) return callback(err);
        callback();
    });
};

Bus.prototype.publishDeleteUser = function (message, callback) {
    if (!callback) {
        callback = function () {
        }
    }

    this.publish('account-deletes', message, function (err) {
        if (err) return callback(err);
        callback();
    });
};

module.exports = Bus;