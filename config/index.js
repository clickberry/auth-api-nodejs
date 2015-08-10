var config = require('nconf');
var defaultConfig = require('nconf');
var path = require('path');

var configName = (process.env.NODE_ENV || "development") + '.json';

config.argv()
    .env('_')
    .file({file: path.join(__dirname, configName)});

defaultConfig.file('default', {file: path.join(__dirname, 'default.json')});

exports.get = function (param) {
    return config.get(param) || defaultConfig.get(param);
};