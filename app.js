var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var passport = require('passport');
var mongoose = require('mongoose');

var config = require('./config');
var routes = require('./routes/index')(passport);

mongoose.connect(config.get('mongo_connection'));

require('./config/passport/jwt-passport')(passport);
require('./config/passport/local-passport')(passport);
require('./config/passport/oauth-passport')(passport);

var app = express();
// For Twitter only ---------------
var session = require('express-session');
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' }));
// For Twitter only ---------------


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));



app.use(passport.initialize());
//app.use(passport.session());

app.use('/api', routes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.send({
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.send({
        message: err.message,
        error: {}
    });
});


module.exports = app;
