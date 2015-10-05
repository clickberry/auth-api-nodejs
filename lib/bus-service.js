"use strict";

var events = require('events');
var util = require('util');
var nsq = require('nsqjs');
var config = require('../config');

/**
 * The client to the Message broker / middleware used to communicate with other services.
 * You can subscribe to events coming from the message broker used {@link https://nodejs.org/api/events.html#events_emitter_on_event_listener|EventEmitter `on` method}.
 * It can emit events via the method {@link Bus#publishNewComment}.
 * @constructor
 */
function Bus(options) {
    var bus = this;

    bus._options = options;
    events.EventEmitter.call(this);

    if (config.get('environment') === 'development' && config.get('nsqd:disable') === 'disable') {
        bus._bus = {
            publish: function (topic, message, callback) {
                console.log('topic: ' + topic);
                console.log(message);
                callback()
            }
        };
        return;
    }

    // connect to the Bus
    var busClient = new nsq.Writer(config.get('nsqd:address'), parseInt(config.get('nsqd:port'), 10));
    bus._bus = busClient;
    busClient.connect();
    busClient.on('ready', function () {
        //bus._bus = busClient;
    });
    busClient.on('error', function (err) {
        console.log(err);
    });
}

util.inherits(Bus, events.EventEmitter);

Bus.prototype.publishSignupUser = function (user, callback) {
    if (!callback) {
        callback = function () {
        }
    }

    this._bus.publish('registrations', user, function (err) {
        if (err) return callback(err);
        callback();
    });
};

Bus.prototype.publishSigninUser = function (user, callback) {
    if (!callback) {
        callback = function () {
        }
    }

    this._bus.publish('logins', user, function (err) {
        if (err) return callback(err);
        callback();
    });
};

Bus.prototype.publishMergeUser = function (message, callback) {
    if (!callback) {
        callback = function () {
        }
    }

    this._bus.publish('account-merges', message, function (err) {
        if (err) return callback(err);
        callback();
    });
};

Bus.prototype.publishUnmergeUser = function (message, callback) {
    if (!callback) {
        callback = function () {
        }
    }

    this._bus.publish('account-unmerges', message, function (err) {
        if (err) return callback(err);
        callback();
    });
};

Bus.prototype.publishDeleteUser = function (message, callback) {
    if (!callback) {
        callback = function () {
        }
    }

    this._bus.publish('account-deletes', message, function (err) {
        if (err) return callback(err);
        callback();
    });
};

module.exports = Bus;