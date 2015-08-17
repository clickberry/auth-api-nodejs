var config = require('nconf');
var path = require('path');

var configName = (process.env.NODE_ENV || "development") + '.json';

config.argv()
    .env('_')
    .file({file: path.join(__dirname, configName)})
    .file('default', {file: path.join(__dirname, 'default.json')});

var get = function (param) {
    return config.get(param.toUpperCase()) || config.get(param);
};

var getInt = function (param, defValue) {
    var value=get(param);
    return parseInt(value) || defValue;
};

exports.get = get;
exports.getInt = getInt;