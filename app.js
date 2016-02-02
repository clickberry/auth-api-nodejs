var express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser');
var passport = require('passport');
var mongoose = require('mongoose');
var cookieParser = require('cookie-parser');

var config = require('clickberry-config');
var routes = require('./routes/index')(passport);

var options = {
    server: {
        socketOptions: {
            keepAlive: 1,
            connectTimeoutMS: 30000
        }
    },
    replset: {
        socketOptions: {
            keepAlive: 1,
            connectTimeoutMS: 30000
        }
    }
};
mongoose.connect(config.get('mongodb:connection'), options);

var adminEmail = config.get('admin:email');
var password = config.get('admin:password');
require('./models/user').createAdmin(adminEmail, password, function (err, admin) {
    if (err) {
        console.log('Created/Updated Admin error.');
    } else {
        console.log('Admin with email \'' + adminEmail + '\' was Created/Updated.');
    }
});

require('./config/passport/jwt-passport')(passport);
require('./config/passport/local-passport')(passport);
require('./config/passport/oauth-passport')(passport);

var app = express();

// Configure CORS
app.use(require('cors')({allowedHeaders: 'Authorization, Content-Type', origin: true, credentials: true}));

app.use(cookieParser());

// For Twitter only ---------------
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

app.use(session({
    secret: 'secretsessionfortwitteroauth1.0',
    saveUninitialized: true,
    resave: true,
    store: new MongoStore({mongooseConnection: mongoose.connection})
}));
// For Twitter only ---------------


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


app.use(passport.initialize());
//app.use(passport.session());

app.use(routes);

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
        if (res.statusCode === 500) {
            console.log(err.message);
            console.log(err.stack);
        }
        res.send({
            message: err.message,
            error: {}
        });
    });
} else {
// production error handler
// no stacktraces leaked to user
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.send({
            message: err.message,
            error: {}
        });
    });
}


module.exports = app;
