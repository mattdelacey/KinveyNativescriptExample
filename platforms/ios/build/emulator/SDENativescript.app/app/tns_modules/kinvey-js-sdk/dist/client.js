'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _fastMemoryCache = require('fast-memory-cache');

var _fastMemoryCache2 = _interopRequireDefault(_fastMemoryCache);

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

var _assign = require('lodash/assign');

var _assign2 = _interopRequireDefault(_assign);

var _isString = require('lodash/isString');

var _isString2 = _interopRequireDefault(_isString);

var _isNumber = require('lodash/isNumber');

var _isNumber2 = _interopRequireDefault(_isNumber);

var _errors = require('./errors');

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DEFAULT_TIMEOUT = 60000;
var ACTIVE_USER_KEY = 'active_user';
var _sharedInstance = null;

var ActiveUserStorage = function () {
  function ActiveUserStorage() {
    _classCallCheck(this, ActiveUserStorage);

    this.memory = new _fastMemoryCache2.default();
  }

  _createClass(ActiveUserStorage, [{
    key: 'get',
    value: function get(key) {
      if (!(0, _isString2.default)(key)) {
        throw new _errors.KinveyError('ActiveUserStorage key must be a string.');
      }

      try {
        return JSON.parse(this.memory.get(key));
      } catch (e) {
        return null;
      }
    }
  }, {
    key: 'set',
    value: function set(key, value) {
      if (!(0, _isString2.default)(key)) {
        throw new _errors.KinveyError('ActiveUserStorage key must be a string.');
      }

      if ((0, _utils.isDefined)(value)) {
        this.memory.set(key, JSON.stringify(value));
      } else {
        this.memory.delete(key);
      }

      return value;
    }
  }]);

  return ActiveUserStorage;
}();

var Client = function () {
  function Client() {
    var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Client);

    var apiHostname = (0, _isString2.default)(config.apiHostname) ? config.apiHostname : 'https://baas.kinvey.com';
    if (/^https?:\/\//i.test(apiHostname) === false) {
      apiHostname = 'https://' + apiHostname;
    }

    var apiHostnameParsed = _url2.default.parse(apiHostname);

    this.apiProtocol = apiHostnameParsed.protocol;

    this.apiHost = apiHostnameParsed.host;

    var micHostname = (0, _isString2.default)(config.micHostname) ? config.micHostname : 'https://auth.kinvey.com';
    if (/^https?:\/\//i.test(micHostname) === false) {
      micHostname = 'https://' + micHostname;
    }

    var micHostnameParsed = _url2.default.parse(micHostname);

    this.micProtocol = micHostnameParsed.protocol;

    this.micHost = micHostnameParsed.host;

    var liveServiceHostname = (0, _isString2.default)(config.liveServiceHostname) ? config.liveServiceHostname : 'https://kls.kinvey.com';
    if (/^https?:\/\//i.test(liveServiceHostname) === false) {
      liveServiceHostname = 'https://' + liveServiceHostname;
    }

    var liveServiceHostnameParsed = _url2.default.parse(liveServiceHostname);

    this.liveServiceProtocol = liveServiceHostnameParsed.protocol;

    this.liveServiceHost = liveServiceHostnameParsed.host;

    this.appKey = config.appKey;

    this.appSecret = config.appSecret;

    this.masterSecret = config.masterSecret;

    this.encryptionKey = config.encryptionKey;

    this.appVersion = config.appVersion;

    this.defaultTimeout = (0, _isNumber2.default)(config.defaultTimeout) && config.defaultTimeout >= 0 ? config.defaultTimeout : DEFAULT_TIMEOUT;

    this.activeUserStorage = new ActiveUserStorage();
  }

  _createClass(Client, [{
    key: 'getActiveUser',
    value: function getActiveUser() {
      return this.activeUserStorage.get(this.appKey + '.' + ACTIVE_USER_KEY);
    }
  }, {
    key: 'setActiveUser',
    value: function setActiveUser(activeUser) {
      return this.activeUserStorage.set(this.appKey + '.' + ACTIVE_USER_KEY, activeUser);
    }
  }, {
    key: 'toPlainObject',
    value: function toPlainObject() {
      return {
        apiHostname: this.apiHostname,
        apiProtocol: this.apiProtocol,
        apiHost: this.apiHost,
        micHostname: this.micHostname,
        micProtocol: this.micProtocol,
        micHost: this.micHost,
        liveServiceHostname: this.liveServiceHostname,
        liveServiceHost: this.liveServiceHost,
        liveServiceProtocol: this.liveServiceProtocol,
        appKey: this.appKey,
        appSecret: this.appSecret,
        masterSecret: this.masterSecret,
        encryptionKey: this.encryptionKey,
        appVersion: this.appVersion
      };
    }
  }, {
    key: 'apiHostname',
    get: function get() {
      return _url2.default.format({
        protocol: this.apiProtocol,
        host: this.apiHost
      });
    }
  }, {
    key: 'micHostname',
    get: function get() {
      return _url2.default.format({
        protocol: this.micProtocol,
        host: this.micHost
      });
    }
  }, {
    key: 'liveServiceHostname',
    get: function get() {
      return _url2.default.format({
        protocol: this.liveServiceProtocol,
        host: this.liveServiceHost
      });
    }
  }], [{
    key: 'initialize',
    value: function initialize() {
      throw new _errors.KinveyError('Please use Client.init().');
    }
  }, {
    key: 'init',
    value: function init(config) {
      _sharedInstance = new Client(config);
      return _sharedInstance;
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