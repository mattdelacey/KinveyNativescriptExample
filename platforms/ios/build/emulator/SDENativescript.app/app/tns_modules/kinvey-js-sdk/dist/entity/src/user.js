'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _es6Promise = require('es6-promise');

var _es6Promise2 = _interopRequireDefault(_es6Promise);

var _assign = require('lodash/assign');

var _assign2 = _interopRequireDefault(_assign);

var _isString = require('lodash/isString');

var _isString2 = _interopRequireDefault(_isString);

var _isObject = require('lodash/isObject');

var _isObject2 = _interopRequireDefault(_isObject);

var _isEmpty = require('lodash/isEmpty');

var _isEmpty2 = _interopRequireDefault(_isEmpty);

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

var _client = require('../../client');

var _client2 = _interopRequireDefault(_client);

var _request = require('../../request');

var _errors = require('../../errors');

var _datastore = require('../../datastore');

var _datastore2 = _interopRequireDefault(_datastore);

var _identity = require('../../identity');

var _utils = require('../../utils');

var _acl = require('./acl');

var _acl2 = _interopRequireDefault(_acl);

var _metadata = require('./metadata');

var _metadata2 = _interopRequireDefault(_metadata);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var User = function () {
  function User() {
    var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, User);

    this.data = data;

    this.client = options.client || _client2.default.sharedInstance();
  }

  _createClass(User, [{
    key: 'isActive',
    value: function isActive() {
      var activeUser = User.getActiveUser(this.client);

      if ((0, _utils.isDefined)(activeUser) && activeUser._id === this._id) {
        return true;
      }

      return false;
    }
  }, {
    key: 'isEmailVerified',
    value: function isEmailVerified() {
      var status = this.metadata.emailVerification;
      return status === 'confirmed';
    }
  }, {
    key: 'login',
    value: function login(username, password) {
      var _this = this;

      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      var credentials = username;
      var isActive = this.isActive();
      var activeUser = User.getActiveUser(this.client);

      if (isActive === true) {
        return _es6Promise2.default.reject(new _errors.ActiveUserError('This user is already the active user.'));
      }

      if ((0, _utils.isDefined)(activeUser)) {
        return _es6Promise2.default.reject(new _errors.ActiveUserError('An active user already exists. Please logout the active user before you login.'));
      }

      if ((0, _isObject2.default)(credentials)) {
        options = password || {};
      } else {
        credentials = {
          username: username,
          password: password
        };
      }

      if ((0, _utils.isDefined)(credentials.username)) {
        credentials.username = String(credentials.username).trim();
      }

      if ((0, _utils.isDefined)(credentials.password)) {
        credentials.password = String(credentials.password).trim();
      }

      if ((!(0, _utils.isDefined)(credentials.username) || credentials.username === '' || !(0, _utils.isDefined)(credentials.password) || credentials.password === '') && !(0, _utils.isDefined)(credentials._socialIdentity)) {
        return _es6Promise2.default.reject(new _errors.KinveyError('Username and/or password missing. Please provide both a username and password to login.'));
      }

      var request = new _request.KinveyRequest({
        method: _request.RequestMethod.POST,
        authType: _request.AuthType.App,
        url: _url2.default.format({
          protocol: this.client.apiProtocol,
          host: this.client.apiHost,
          pathname: this.pathname + '/login'
        }),
        body: credentials,
        properties: options.properties,
        timeout: options.timeout,
        client: this.client
      });

      return request.execute().then(function (response) {
        return response.data;
      }).then(function (data) {
        if ((0, _utils.isDefined)(credentials._socialIdentity) && (0, _utils.isDefined)(data._socialIdentity)) {
          var identities = Object.keys(data._socialIdentity);
          identities.forEach(function (identity) {
            data._socialIdentity[identity] = (0, _assign2.default)({}, credentials._socialIdentity[identity], data._socialIdentity[identity]);
          });
          data._socialIdentity = (0, _assign2.default)({}, credentials._socialIdentity, data._socialIdentity);
        }

        delete data.password;

        return _this.client.setActiveUser(data);
      }).then(function (data) {
        _this.data = data;
        return _this;
      });
    }
  }, {
    key: 'loginWithMIC',
    value: function loginWithMIC(redirectUri, authorizationGrant) {
      var _this2 = this;

      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      var isActive = this.isActive();
      var activeUser = User.getActiveUser(this.client);

      if (isActive) {
        return _es6Promise2.default.reject(new _errors.ActiveUserError('This user is already the active user.'));
      }

      if ((0, _utils.isDefined)(activeUser)) {
        return _es6Promise2.default.reject(new _errors.ActiveUserError('An active user already exists. Please logout the active user before you login.'));
      }

      var mic = new _identity.MobileIdentityConnect({ client: this.client });
      return mic.login(redirectUri, authorizationGrant, options).then(function (session) {
        return _this2.connectIdentity(_identity.MobileIdentityConnect.identity, session, options);
      });
    }
  }, {
    key: 'connectIdentity',
    value: function connectIdentity(identity, session) {
      var _this3 = this;

      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      var isActive = this.isActive();
      var data = {};
      var socialIdentity = data._socialIdentity || {};
      socialIdentity[identity] = session;
      data._socialIdentity = socialIdentity;

      if (isActive) {
        return this.update(data, options);
      }

      return this.login(data, options).catch(function (error) {
        if (error instanceof _errors.NotFoundError) {
          return _this3.signup(data, options).then(function () {
            return _this3.connectIdentity(identity, session, options);
          });
        }

        throw error;
      });
    }
  }, {
    key: 'disconnectIdentity',
    value: function disconnectIdentity(identity) {
      var _this4 = this;

      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      var promise = _es6Promise2.default.resolve();

      if (identity === _identity.MobileIdentityConnect.identity) {
        promise = _identity.MobileIdentityConnect.logout(this, options);
      }

      return promise.catch(function (error) {
        _utils.Log.error(error);
      }).then(function () {
        var data = _this4.data;
        var socialIdentity = data._socialIdentity || {};
        delete socialIdentity[identity];
        data._socialIdentity = socialIdentity;
        _this4.data = data;

        if (!_this4._id) {
          return _this4;
        }

        return _this4.update(data, options);
      }).then(function () {
        return _this4;
      });
    }
  }, {
    key: 'logout',
    value: function logout() {
      var _this5 = this;

      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      var request = new _request.KinveyRequest({
        method: _request.RequestMethod.POST,
        authType: _request.AuthType.Session,
        url: _url2.default.format({
          protocol: this.client.apiProtocol,
          host: this.client.apiHost,
          pathname: this.pathname + '/_logout'
        }),
        properties: options.properties,
        timeout: options.timeout,
        client: this.client
      });

      return request.execute().catch(function (error) {
        _utils.Log.error(error);
        return null;
      }).then(function () {
        return _this5.client.setActiveUser(null);
      }).catch(function (error) {
        _utils.Log.error(error);
        return null;
      }).then(function () {
        return _datastore2.default.clearCache({ client: _this5.client });
      }).catch(function (error) {
        _utils.Log.error(error);
        return null;
      }).then(function () {
        return _this5;
      });
    }
  }, {
    key: 'signup',
    value: function signup(data) {
      var _this6 = this;

      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      var activeUser = User.getActiveUser(this.client);
      options = (0, _assign2.default)({
        state: true
      }, options);

      if (options.state === true && (0, _utils.isDefined)(activeUser)) {
        throw new _errors.ActiveUserError('An active user already exists. Please logout the active user before you login.');
      }

      if (data instanceof User) {
        data = data.data;
      }

      data = (0, _assign2.default)(this.data, data);

      var request = new _request.KinveyRequest({
        method: _request.RequestMethod.POST,
        authType: _request.AuthType.App,
        url: _url2.default.format({
          protocol: this.client.apiProtocol,
          host: this.client.apiHost,
          pathname: this.pathname
        }),
        body: (0, _isEmpty2.default)(data) ? null : data,
        properties: options.properties,
        timeout: options.timeout,
        client: this.client
      });

      return request.execute().then(function (response) {
        return response.data;
      }).then(function (data) {
        if (options.state === true) {
          return _this6.client.setActiveUser(data);
        }

        return data;
      }).then(function (data) {
        _this6.data = data;
        return _this6;
      });
    }
  }, {
    key: 'signupWithIdentity',
    value: function signupWithIdentity(identity, session) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      var data = {};
      data._socialIdentity = {};
      data._socialIdentity[identity] = session;
      return this.signup(data, options);
    }
  }, {
    key: 'update',
    value: function update(data) {
      var _this7 = this;

      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      data = (0, _assign2.default)(this.data, data);
      var store = new _datastore.UserStore();
      return store.update(data, options).then(function (data) {
        if (_this7.isActive()) {
          return _this7.client.setActiveUser(data);
        }

        return data;
      }).then(function (data) {
        _this7.data = data;
        return _this7;
      });
    }
  }, {
    key: 'me',
    value: function me() {
      var _this8 = this;

      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      var request = new _request.KinveyRequest({
        method: _request.RequestMethod.GET,
        authType: _request.AuthType.Session,
        url: _url2.default.format({
          protocol: this.client.apiProtocol,
          host: this.client.apiHost,
          pathname: this.pathname + '/_me'
        }),
        properties: options.properties,
        timeout: options.timeout
      });

      return request.execute().then(function (response) {
        return response.data;
      }).then(function (data) {
        data = (0, _assign2.default)(_this8.data, data);

        delete data.password;

        if (_this8.isActive()) {
          return _this8.client.setActiveUser(data);
        }

        return data;
      }).then(function (data) {
        _this8.data = data;
        return _this8;
      });
    }
  }, {
    key: '_id',
    get: function get() {
      return this.data._id;
    }
  }, {
    key: '_acl',
    get: function get() {
      return new _acl2.default(this.data);
    }
  }, {
    key: 'metadata',
    get: function get() {
      return new _metadata2.default(this.data);
    }
  }, {
    key: '_kmd',
    get: function get() {
      return this.metadata;
    }
  }, {
    key: '_socialIdentity',
    get: function get() {
      return this.data._socialIdentity;
    }
  }, {
    key: 'authtoken',
    get: function get() {
      return this.metadata.authtoken;
    }
  }, {
    key: 'username',
    get: function get() {
      return this.data.username;
    }
  }, {
    key: 'email',
    get: function get() {
      return this.data.email;
    }
  }, {
    key: 'pathname',
    get: function get() {
      return '/user/' + this.client.appKey;
    }
  }], [{
    key: 'login',
    value: function login(username, password) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      var user = new this({}, options);
      return user.login(username, password, options);
    }
  }, {
    key: 'loginWithMIC',
    value: function loginWithMIC(redirectUri, authorizationGrant) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      var user = new this({}, options);
      return user.loginWithMIC(redirectUri, authorizationGrant, options);
    }
  }, {
    key: 'connectIdentity',
    value: function connectIdentity(identity, session) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      var user = new this({}, options);
      return user.connectIdentity(identity, session, options);
    }
  }, {
    key: 'logout',
    value: function logout() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      var activeUser = User.getActiveUser(options.client);

      if ((0, _utils.isDefined)(activeUser)) {
        return activeUser.logout(options);
      }

      return _es6Promise2.default.resolve(null);
    }
  }, {
    key: 'signup',
    value: function signup(data) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      var user = new this({}, options);
      return user.signup(data, options);
    }
  }, {
    key: 'signupWithIdentity',
    value: function signupWithIdentity(identity, session) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      var user = new this({}, options);
      return user.signupWithIdentity(identity, session, options);
    }
  }, {
    key: 'update',
    value: function update(data) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      var activeUser = User.getActiveUser(options.client);

      if ((0, _utils.isDefined)(activeUser)) {
        return activeUser.update(data, options);
      }

      return _es6Promise2.default.resolve(null);
    }
  }, {
    key: 'me',
    value: function me() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      var activeUser = User.getActiveUser(options.client);

      if (activeUser) {
        return activeUser.me(options);
      }

      return _es6Promise2.default.resolve(null);
    }
  }, {
    key: 'getActiveUser',
    value: function getActiveUser() {
      var client = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _client2.default.sharedInstance();

      var data = client.getActiveUser();

      if ((0, _utils.isDefined)(data)) {
        return new this(data, { client: client });
      }

      return null;
    }
  }, {
    key: 'verifyEmail',
    value: function verifyEmail(username) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      if (!username) {
        return _es6Promise2.default.reject(new _errors.KinveyError('A username was not provided.', 'Please provide a username for the user that you would like to verify their email.'));
      }

      if (!(0, _isString2.default)(username)) {
        return _es6Promise2.default.reject(new _errors.KinveyError('The provided username is not a string.'));
      }

      var client = options.client || _client2.default.sharedInstance();
      var request = new _request.KinveyRequest({
        method: _request.RequestMethod.POST,
        authType: _request.AuthType.App,
        url: _url2.default.format({
          protocol: client.apiProtocol,
          host: client.apiHost,
          pathname: '/rpc/' + client.appKey + '/' + username + '/user-email-verification-initiate'
        }),
        properties: options.properties,
        timeout: options.timeout,
        client: client
      });
      return request.execute().then(function (response) {
        return response.data;
      });
    }
  }, {
    key: 'forgotUsername',
    value: function forgotUsername(email) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      if (!email) {
        return _es6Promise2.default.reject(new _errors.KinveyError('An email was not provided.', 'Please provide an email for the user that you would like to retrieve their username.'));
      }

      if (!(0, _isString2.default)(email)) {
        return _es6Promise2.default.reject(new _errors.KinveyError('The provided email is not a string.'));
      }

      var client = options.client || _client2.default.sharedInstance();
      var request = new _request.KinveyRequest({
        method: _request.RequestMethod.POST,
        authType: _request.AuthType.App,
        url: _url2.default.format({
          protocol: client.apiProtocol,
          host: client.apiHost,
          pathname: '/rpc/' + client.appKey + '/user-forgot-username'
        }),
        properties: options.properties,
        data: { email: email },
        timeout: options.timeout,
        client: client
      });
      return request.execute().then(function (response) {
        return response.data;
      });
    }
  }, {
    key: 'resetPassword',
    value: function resetPassword(username) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      if (!username) {
        return _es6Promise2.default.reject(new _errors.KinveyError('A username was not provided.', 'Please provide a username for the user that you would like to verify their email.'));
      }

      if (!(0, _isString2.default)(username)) {
        return _es6Promise2.default.reject(new _errors.KinveyError('The provided username is not a string.'));
      }

      var client = options.client || _client2.default.sharedInstance();
      var request = new _request.KinveyRequest({
        method: _request.RequestMethod.POST,
        authType: _request.AuthType.App,
        url: _url2.default.format({
          protocol: client.apiProtocol,
          host: client.apiHost,
          pathname: '/rpc/' + client.appKey + '/' + username + '/user-password-reset-initiate'
        }),
        properties: options.properties,
        timeout: options.timeout,
        client: client
      });
      return request.execute().then(function (response) {
        return response.data;
      });
    }
  }, {
    key: 'lookup',
    value: function lookup(query) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      var store = new _datastore.UserStore();
      return store.lookup(query, options);
    }
  }, {
    key: 'exists',
    value: function exists(username) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      var store = new _datastore.UserStore();
      return store.exists(username, options);
    }
  }, {
    key: 'remove',
    value: function remove(id) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      var store = new _datastore.UserStore();
      return store.removeById(id, options);
    }
  }, {
    key: 'restore',
    value: function restore() {
      return _es6Promise2.default.reject(new _errors.KinveyError('This function requires a master secret to be provided for your application.' + ' We strongly advise not to do this.'));
    }
  }]);

  return User;
}();

exports.default = User;