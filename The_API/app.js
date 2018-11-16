// app.js
var express = require('express');
var cors = require('cors')
// var session = require('express-handlebars')
var app = express();
var passport = require('passport')
app.use(cors())
var db = require('./db');
var UserController = require('./Usercontroller');
var ClassController = require('./Classcontroller');
app.use('/users', UserController);
app.use('/classes', ClassController);
var session = require('express-session');
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var mongoose    = require('mongoose');
var jwt         = require('jwt-simple');


// use sessions for tracking logins
// app.use(session({
//     secret: 'work hard',
//     resave: true,
//     saveUninitialized: false
//   }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(passport.initialize());


module.exports = app;
