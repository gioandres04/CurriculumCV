
var createError = require('http-errors');
var express = require('express');
var cookieParser = require('cookie-parser');
const nodemailer = require('nodemailer');
const session = require('express-session');
var logger = require('morgan');
const http = require('http');
var path = require('path');
const passport = require('passport');
const port = 5000;


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
app.use(session({secret:"cats"}));
app.use(passport.initialize());
app.use(passport.session());

const server = http.createServer(app);
/* const db = require('./conf/db'); */
const ContactosController = require('./controllers/ContactosController');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

server.listen(port,()=>{
  console.log(`Servidor en el puerto ${port}`);
});
