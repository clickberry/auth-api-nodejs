var nconf = require('nconf');
var path = require('path');

var configName = process.env.NODE_ENV || "development" + '.json';

nconf.argv()
    .env()
    .file({file: path.join(__dirname, configName)});

module.exports = nconf;