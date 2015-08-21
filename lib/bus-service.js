var events = require('events');
var util = require('util');

/**
 * The client to the Message broker / middleware used to communicate with other services.
 * You can subscribe to events coming from the message broker used {@link https://nodejs.org/api/events.html#events_emitter_on_event_listener|EventEmitter `on` method}.
 * It can emit events via the method {@link Bus#publishNewComment}.
 * @constructor
 */
function Bus(options) {
    this._options = options;
    events.EventEmitter.call(this);
}

util.inherits(Bus, events.EventEmitter);

/**
 *
 */
Bus.prototype.publishSignupUser = function (message) {
    console.log(message);
};

Bus.prototype.publishSigninUser = function (message) {
    console.log(message);
};

Bus.prototype.publishMergeUser = function (message) {
    console.log(message);
};

Bus.prototype.publishUnmergeUser = function (message) {
    console.log(message);
};

Bus.prototype.publishDeleteUser = function (message) {
    console.log(message);
};

module.exports = Bus;