var util = require('util');
var Q = require('q');
var Publisher = require('clickberry-nsq-publisher');

function Bus(options) {
    Publisher.call(this, options);
}

util.inherits(Bus, Publisher);

Bus.prototype.publishSignupUser = function (user, callback) {
    var publishAsync = Q.nbind(this.publish, this);
    Q.all([publishAsync('registrations', user), publishAsync('account-creates', user)])
        .then(function () {
            callback();
        }, function (err) {
            callback(err);
        });
};

Bus.prototype.publishSigninUser = function (user, callback) {
    var publishAsync = Q.nbind(this.publish, this);
    Q.all([publishAsync('account-signins', user)])
        .then(function () {
            callback();
        }, function (err) {
            callback(err);
        });
};

Bus.prototype.publishMergeUser = function (message, callback) {
    var publishAsync = Q.nbind(this.publish, this);
    Q.all([publishAsync('account-merges', message)])
        .then(function () {
            callback();
        }, function (err) {
            callback(err);
        });
};

Bus.prototype.publishUnmergeUser = function (message, callback) {
    var publishAsync = Q.nbind(this.publish, this);
    Q.all([publishAsync('account-unmerges', message)])
        .then(function () {
            callback();
        }, function (err) {
            callback(err);
        });
};

Bus.prototype.publishDeleteUser = function (message, callback) {
    var publishAsync = Q.nbind(this.publish, this);
    Q.all([publishAsync('account-deletes', message)])
        .then(function () {
            callback();
        }, function (err) {
            callback(err);
        });
};

module.exports = Bus;