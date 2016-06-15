var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mysql      = require('mysql');

var routes = require('./routes/index');
var input = require('./routes/input');

var app = express();

/*
Necessary environmental variables for the database
*/
console.info("MYSQL HOST :: ",process.env['MYSQL_HOST']);
console.info("MYSQL USERNAME:: ",process.env['MYSQL_USERNAME']);
console.info("MYSQL PASSWORD:: ",process.env['MYSQL_PASSWORD']);
console.info("MYSQL DATABASE:: ",process.env['MYSQL_DATABASE']);





/*
Create a database connection
*/
global.MYSQL_CONNECTION = mysql.createConnection({
  host     : process.env['MYSQL_HOST'],
  user     : process.env['MYSQL_USERNAME'],
  password : process.env['MYSQL_PASSWORD'],
  database : process.env['MYSQL_DATABASE']
});

MYSQL_CONNECTION.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }

  console.log('connected as id ' + MYSQL_CONNECTION.threadId);
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/input', input);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
