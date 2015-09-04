var config = require('nconf');
var path = require('path');

var configName = (process.env.NODE_ENV || "development") + '.json';

config.argv()
    .env('_')
    .file('default', {file: path.join(__dirname, 'default.json')})
    .file({file: path.join(__dirname, configName)});

var get = function (param) {
    return config.get(param.toUpperCase()) || config.get(param);
};

var getInt = function (param, defValue) {
    var value = get(param);
    return parseInt(value) || defValue;
};

var getUrl = function (param) {
    var url = get('protocol') + '://' + get('host:name');
    var hostName = get('host:port') == 80 ? url : url + ':' + get('host:port');
    var pathUrl = get(param);
    return hostName + pathUrl;
};

exports.get = get;
exports.getInt = getInt;
exports.getUrl = getUrl;