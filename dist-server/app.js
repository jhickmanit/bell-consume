"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.onfido = void 0;

var _express = _interopRequireDefault(require("express"));

var _path = require("path");

var _morgan = _interopRequireDefault(require("morgan"));

var _expressSession = _interopRequireDefault(require("express-session"));

var _openidClient = require("openid-client");

var _api = require("@onfido/api");

var _index = _interopRequireDefault(require("./routes/index"));

//import createError from 'http-errors'
var app = (0, _express["default"])();
var onfido = new _api.Onfido({
  apiToken: process.env.ONFIDO_API_TOKEN
}); // view engine setup

exports.onfido = onfido;
app.set('views', (0, _path.join)(__dirname, 'views'));
app.set('view engine', 'pug');
app.use((0, _morgan["default"])('dev'));
app.use(_express["default"].json());
app.use(_express["default"].urlencoded({
  extended: false
}));
app.use(_express["default"]["static"]((0, _path.join)(__dirname, 'public')));
app.use((0, _expressSession["default"])({
  secret: process.env.SESSION_SECRET,
  saveUninitialized: true,
  resave: true
}));
app.use(function (req, res, next) {
  var sess = req.session;
  var nonce = sess.nonce;
  var state = sess.state;

  if (nonce === undefined || nonce === '') {
    var newNonce = _openidClient.generators.nonce();

    req.session.nonce = newNonce;

    if (state === undefined || state === '') {
      var newState = _openidClient.generators.state();

      req.session.state = newState;
      next();
    }

    next();
  } else if (state === undefined || state === '') {
    var _newState = _openidClient.generators.state();

    req.session.state = _newState;
    next();
  }

  next();
});
app.use(_index["default"]); // catch 404 and forward to error handler

/* app.use(function(req, res, next) {
    next(createError(404))
}) */

/* // error handler
app.use(function(err, req, res) {
    // set locals, only providing error in development
    res.locals.message = err.message
    res.locals.error = req.app.get('env') === 'development' ? err : {}

    // render the error page
    res.status(err.status || 500)
    res.render('error')
}) */

var _default = app;
exports["default"] = _default;