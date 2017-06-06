'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _assign = require('lodash/assign');

var _assign2 = _interopRequireDefault(_assign);

var _isString = require('lodash/isString');

var _isString2 = _interopRequireDefault(_isString);

var _isNumber = require('lodash/isNumber');

var _isNumber2 = _interopRequireDefault(_isNumber);

var _errors = require('./errors');

var _utils = require('./utils');

var _activeUserHelper = require('./entity/src/activeUserHelper');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _sharedInstance = null;

var Client = function () {
  function Client() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Client);

    options = (0, _assign2.default)({
      apiHostname: 'https://baas.kinvey.com',
      micHostname: 'https://auth.kinvey.com',
      liveServiceHostname: 'https://kls.kinvey.com',
      defaultTimeout: 60000
    }, options);

    var apiHostname = options.apiHostname;
    if ((0, _isString2.default)(apiHostname) === false) {
      apiHostname = String(apiHostname);
    }
    this.apiHostname = apiHostname.replace(/\/+$/, '');

    var micHostname = options.micHostname;
    if ((0, _isString2.default)(apiHostname) === false) {
      micHostname = String(micHostname);
    }
    this.micHostname = micHostname.replace(/\/+$/, '');

    var liveServiceHostname = options.liveServiceHostname;
    if ((0, _isString2.default)(liveServiceHostname) === false) {
      liveServiceHostname = String(liveServiceHostname);
    }
    this.liveServiceHostname = liveServiceHostname.replace(/\/+$/, '');

    this.appKey = options.appKey;

    this.appSecret = options.appSecret;

    this.masterSecret = options.masterSecret;

    this.encryptionKey = options.encryptionKey;

    if ((0, _utils.isDefined)(options.appVersion)) {
      var appVersion = options.appVersion;

      if ((0, _isString2.default)(appVersion) === false) {
        appVersion = String(appVersion);
      }

      this.appVersion = appVersion;
    }

    if ((0, _utils.isDefined)(options.defaultTimeout)) {
      var timeout = parseInt(options.defaultTimeout, 10);

      if ((0, _isNumber2.default)(timeout) === false || isNaN(timeout)) {
        throw new _errors.KinveyError('Invalid timeout. Timeout must be a number.');
      }

      if (timeout < 0) {
        _utils.Log.info('Default timeout is less than 0. Setting default timeout to 60000ms.');
        timeout = 60000;
      }

      this.defaultTimeout = timeout;
    }
  }

  _createClass(Client, [{
    key: 'toPlainObject',
    value: function toPlainObject() {
      return {
        apiHostname: this.apiHostname,
        micHostname: this.micHostname,
        liveServiceHostname: this.liveServiceHostname,
        appKey: this.appKey,
        appSecret: this.appSecret,
        masterSecret: this.masterSecret,
        encryptionKey: this.encryptionKey,
        appVersion: this.appVersion,
        defaultTimeout: this.defaultTimeout
      };
    }
  }, {
    key: 'activeUser',
    get: function get() {
      return _activeUserHelper.ActiveUserHelper.get(this);
    }
  }], [{
    key: 'initialize',
    value: function initialize() {
      throw new _errors.KinveyError('Please use Client.init().');
    }
  }, {
    key: 'init',
    value: function init(options) {
      var client = new Client(options);
      _sharedInstance = client;
      return client;
    }
  }, {
    key: 'sharedInstance',
    value: function sharedInstance() {
      if ((0, _utils.isDefined)(_sharedInstance) === false) {
        throw new _errors.KinveyError('You have not initialized the library. ' + 'Please call Kinvey.init() to initialize the library.');
      }

      return _sharedInstance;
    }
  }]);

  return Client;
}();

exports.default = Client;