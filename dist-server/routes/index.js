"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _express = require("express");

var _openidClient = require("openid-client");

var _app = require("../app");

var router = (0, _express.Router)();
var oktaClient;
var oktaIssuer;
/* GET home page. */

router.get('/', /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res) {
    var sess, applicant, nonce, state, issuer, client, authURL;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            sess = req.session;
            applicant = sess.applicant;
            nonce = sess.nonce;
            state = sess.state;

            if (!(applicant === undefined || applicant === '')) {
              _context.next = 16;
              break;
            }

            _context.next = 7;
            return _openidClient.Issuer.discover(process.env.OIDC_DISCOVER).then(function (issuer) {
              return issuer;
            });

          case 7:
            issuer = _context.sent;
            oktaIssuer = issuer;
            client = new oktaIssuer.Client({
              client_id: process.env.OIDC_CLIENT_ID,
              redirect_uris: [process.env.APP_URL + 'cb'],
              response_types: ['id_token']
            });
            authURL = client.authorizationUrl({
              scope: 'openid profile',
              response_mode: 'form_post',
              nonce: nonce,
              state: state
            });
            oktaClient = client;
            res.redirect(authURL);
            return _context.abrupt("return");

          case 16:
            console.log('applicantId: ' + applicant);

            _app.onfido.sdkToken.generate({
              applicantId: applicant,
              referrer: '*://*/*'
            }).then(function (token) {
              res.render('index', {
                token: token
              });
              return;
            });

          case 18:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}());
router.post('/cb', function (req, res) {
  var sess = req.session;
  var nonce = sess.nonce;
  var state = sess.state;
  var params = oktaClient.callbackParams(req);
  console.log(params);
  oktaClient.callback(process.env.APP_URL + '/cb', params, {
    nonce: nonce,
    state: state
  }).then(function (tokenSet) {
    console.log(tokenSet);

    if (tokenSet.expired()) {
      res.status(401);
      res.locals.message = 'token expired';
      res.locals.error = {
        status: 500,
        stack: 'token expired'
      };
      res.render('error');
    }

    var claims = tokenSet.claims();
    console.log(claims);

    if (claims.applicant === '' || claims.applicant === undefined) {
      res.status(401);
      res.locals.message = 'applicant missing';
      res.locals.error = {
        status: 500,
        stack: 'applicant missing'
      };
      res.render('error');
    } else {
      req.session.applicant = claims.applicant;
      res.redirect('/');
    }
  });
});
router.get('/complete', function (req, res) {
  var sess = req.session;
  var applicant = sess.applicant;

  if (applicant === '' || applicant === undefined) {
    res.status(500);
    res.render('error');
  }

  _app.onfido.check.create({
    applicantId: applicant,
    reportNames: ['facial_similarity_photo']
  }).then(function (response) {
    res.locals.message = response;
    res.status(200).json({
      redirect: process.env.APP_URL + 'done'
    });
    return;
  });
});
router.get('/done', function (req, res) {
  res.render('complete');
  return;
});
var _default = router;
exports["default"] = _default;