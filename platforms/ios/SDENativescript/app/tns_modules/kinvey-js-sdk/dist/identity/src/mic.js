'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MobileIdentityConnect = exports.AuthorizationGrant = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _es6Promise = require('es6-promise');

var _es6Promise2 = _interopRequireDefault(_es6Promise);

var _isString = require('lodash/isString');

var _isString2 = _interopRequireDefault(_isString);

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

var _urlJoin = require('url-join');

var _urlJoin2 = _interopRequireDefault(_urlJoin);

var _request = require('../../request');

var _errors = require('../../errors');

var _utils = require('../../utils');

var _popup = require('./popup');

var _popup2 = _interopRequireDefault(_popup);

var _identity = require('./identity');

var _identity2 = _interopRequireDefault(_identity);

var _enums = require('./enums');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Popup = _popup2.default;

var AuthorizationGrant = {
  AuthorizationCodeLoginPage: 'AuthorizationCodeLoginPage',
  AuthorizationCodeAPI: 'AuthorizationCodeAPI'
};
Object.freeze(AuthorizationGrant);
exports.AuthorizationGrant = AuthorizationGrant;

var MobileIdentityConnect = exports.MobileIdentityConnect = function (_Identity) {
  _inherits(MobileIdentityConnect, _Identity);

  function MobileIdentityConnect() {
    _classCallCheck(this, MobileIdentityConnect);

    return _possibleConstructorReturn(this, (MobileIdentityConnect.__proto__ || Object.getPrototypeOf(MobileIdentityConnect)).apply(this, arguments));
  }

  _createClass(MobileIdentityConnect, [{
    key: 'isSupported',
    value: function isSupported() {
      return true;
    }
  }, {
    key: 'login',
    value: function login(redirectUri) {
      var _this2 = this;

      var authorizationGrant = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : AuthorizationGrant.AuthorizationCodeLoginPage;
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      var clientId = this.client.appKey;

      if ((0, _isString2.default)(options.micId)) {
        clientId = clientId + ':' + options.micId;
      }

      var promise = _es6Promise2.default.resolve().then(function () {
        if (authorizationGrant === AuthorizationGrant.AuthorizationCodeLoginPage) {
          return _this2.requestCodeWithPopup(clientId, redirectUri, options);
        } else if (authorizationGrant === AuthorizationGrant.AuthorizationCodeAPI) {
          return _this2.requestTempLoginUrl(clientId, redirectUri, options).then(function (url) {
            return _this2.requestCodeWithUrl(url, clientId, redirectUri, options);
          });
        }

        throw new _errors.KinveyError('The authorization grant ' + authorizationGrant + ' is unsupported. ' + 'Please use a supported authorization grant.');
      }).then(function (code) {
        return _this2.requestToken(code, clientId, redirectUri, options);
      }).then(function (session) {
        session.identity = MobileIdentityConnect.identity;
        session.client_id = clientId;
        session.redirect_uri = redirectUri;
        session.protocol = _this2.client.micProtocol;
        session.host = _this2.client.micHost;
        return session;
      });

      return promise;
    }
  }, {
    key: 'refresh',
    value: function refresh(token, clientId, redirectUri) {
      var _this3 = this;

      var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

      return _es6Promise2.default.resolve().then(function () {
        return _this3.refreshToken(token, clientId, redirectUri, options);
      }).then(function (session) {
        session.identity = MobileIdentityConnect.identity;
        session.client_id = clientId;
        session.redirect_uri = redirectUri;
        session.protocol = _this3.client.micProtocol;
        session.host = _this3.client.micHost;
        return session;
      });
    }
  }, {
    key: 'requestTempLoginUrl',
    value: function requestTempLoginUrl(clientId, redirectUri) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      var pathname = '/oauth/auth';

      if (options.version) {
        var version = options.version;

        if ((0, _isString2.default)(version) === false) {
          version = String(version);
        }

        pathname = (0, _urlJoin2.default)(version.indexOf('v') === 0 ? version : 'v' + version, pathname);
      }

      var request = new _request.KinveyRequest({
        method: _request.RequestMethod.POST,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        url: _url2.default.format({
          protocol: this.client.micProtocol,
          host: this.client.micHost,
          pathname: pathname
        }),
        properties: options.properties,
        body: {
          client_id: clientId,
          redirect_uri: redirectUri,
          response_type: 'code'
        }
      });
      return request.execute().then(function (response) {
        return response.data.temp_login_uri;
      });
    }
  }, {
    key: 'requestCodeWithPopup',
    value: function requestCodeWithPopup(clientId, redirectUri) {
      var _this4 = this;

      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      var promise = _es6Promise2.default.resolve().then(function () {
        var pathname = '/oauth/auth';
        var popup = new Popup();

        if (options.version) {
          var version = options.version;

          if (!(0, _isString2.default)(version)) {
            version = String(version);
          }

          pathname = (0, _urlJoin2.default)(version.indexOf('v') === 0 ? version : 'v' + version, pathname);
        }

        return popup.open(_url2.default.format({
          protocol: _this4.client.micProtocol,
          host: _this4.client.micHost,
          pathname: pathname,
          query: {
            client_id: clientId,
            redirect_uri: redirectUri,
            response_type: 'code'
          }
        }));
      }).then(function (popup) {
        var promise = new _es6Promise2.default(function (resolve, reject) {
          var redirected = false;

          function loadCallback(event) {
            try {
              if (event.url && event.url.indexOf(redirectUri) === 0 && redirected === false) {
                redirected = true;
                popup.removeAllListeners();
                popup.close();
                resolve(_url2.default.parse(event.url, true).query.code);
              }
            } catch (error) {}
          }

          function errorCallback(event) {
            try {
              if (event.url && event.url.indexOf(redirectUri) === 0 && redirected === false) {
                redirected = true;
                popup.removeAllListeners();
                popup.close();
                resolve(_url2.default.parse(event.url, true).query.code);
              } else if (redirected === false) {
                popup.removeAllListeners();
                popup.close();
                reject(new _errors.KinveyError(event.message, '', event.code));
              }
            } catch (error) {}
          }

          function exitCallback() {
            if (redirected === false) {
              popup.removeAllListeners();
              reject(new _errors.KinveyError('Login has been cancelled.'));
            }
          }

          popup.on('loadstart', loadCallback);
          popup.on('loadstop', loadCallback);
          popup.on('error', errorCallback);
          popup.on('exit', exitCallback);
        });
        return promise;
      });

      return promise;
    }
  }, {
    key: 'requestCodeWithUrl',
    value: function requestCodeWithUrl(loginUrl, clientId, redirectUri) {
      var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

      var promise = _es6Promise2.default.resolve().then(function () {
        var request = new _request.KinveyRequest({
          method: _request.RequestMethod.POST,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          url: loginUrl,
          properties: options.properties,
          body: {
            client_id: clientId,
            redirect_uri: redirectUri,
            response_type: 'code',
            username: options.username,
            password: options.password
          },
          followRedirect: false
        });
        return request.execute();
      }).then(function (response) {
        var location = response.headers.get('location');

        if (location) {
          return _url2.default.parse(location, true).query.code;
        }

        throw new _errors.MobileIdentityConnectError('Unable to authorize user with username ' + options.username + '.', 'A location header was not provided with a code to exchange for an auth token.');
      });

      return promise;
    }
  }, {
    key: 'requestToken',
    value: function requestToken(code, clientId, redirectUri) {
      var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

      var request = new _request.KinveyRequest({
        method: _request.RequestMethod.POST,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        authType: _request.AuthType.App,
        url: _url2.default.format({
          protocol: this.client.micProtocol,
          host: this.client.micHost,
          pathname: '/oauth/token'
        }),
        properties: options.properties,
        body: {
          grant_type: 'authorization_code',
          client_id: clientId,
          redirect_uri: redirectUri,
          code: code
        }
      });
      return request.execute().then(function (response) {
        return response.data;
      });
    }
  }, {
    key: 'refreshToken',
    value: function refreshToken(token, clientId, redirectUri) {
      var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

      var request = new _request.KinveyRequest({
        method: _request.RequestMethod.POST,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        authType: _request.AuthType.App,
        url: _url2.default.format({
          protocol: this.client.micProtocol,
          host: this.client.micHost,
          pathname: '/oauth/token'
        }),
        body: {
          grant_type: 'refresh_token',
          client_id: clientId,
          redirect_uri: redirectUri,
          refresh_token: token
        },
        properties: options.properties,
        timeout: options.timeout
      });
      return request.execute().then(function (response) {
        return response.data;
      });
    }
  }, {
    key: 'logout',
    value: function logout(user) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      var request = new _request.KinveyRequest({
        method: _request.RequestMethod.GET,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        authType: _request.AuthType.App,
        url: _url2.default.format({
          protocol: this.client.micProtocol,
          host: this.client.micHost,
          pathname: '/oauth/invalidate',
          query: {
            user: user._id
          }
        }),
        properties: options.properties
      });
      return request.execute().then(function (response) {
        return response.data;
      });
    }
  }, {
    key: 'identity',
    get: function get() {
      return _enums.SocialIdentity.MobileIdentityConnect;
    }
  }], [{
    key: 'isSupported',
    value: function isSupported() {
      return true;
    }
  }, {
    key: 'usePopupClass',
    value: function usePopupClass(PopupClass) {
      if ((0, _utils.isDefined)(PopupClass)) {
        Popup = PopupClass;
      }
    }
  }, {
    key: 'identity',
    get: function get() {
      return _enums.SocialIdentity.MobileIdentityConnect;
    }
  }]);

  return MobileIdentityConnect;
}(_identity2.default);