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

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

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
      defaultTimeout: 60000
    }, options);

    this.apiHostname = options.apiHostname;

    if ((0, _isString2.default)(this.apiHostname) === false) {
      throw new KivneyError('apiHostname must be a string');
    }

    if (/^https?:\/\//i.test(this.apiHostname) === false) {
      this.apiHostname = 'https://' + this.apiHostname;
    }

    var apiHostnameParsed = _url2.default.parse(this.apiHostname);
    this.apiProtocol = apiHostnameParsed.protocol;
    this.apiHost = apiHostnameParsed.host;

    this.micHostname = options.micHostname;

    if ((0, _isString2.default)(this.micHostname) === false) {
      throw new KivneyError('micHostname must be a string');
    }

    if (/^https?:\/\//i.test(this.micHostname) === false) {
      this.micHostname = 'https://' + this.micHostname;
    }

    var micHostnameParsed = _url2.default.parse(this.micHostname);
    this.micProtocol = micHostnameParsed.protocol;
    this.micHost = micHostnameParsed.host;

    this.appKey = options.appKey;

    this.appSecret = options.appSecret;

    this.masterSecret = options.masterSecret;

    this.encryptionKey = options.encryptionKey;

    this.appVersion = options.appVersion;

    this.defaultTimeout = options.defaultTimeout;

    if ((0, _isNumber2.default)(this.defaultTimeout) === false || isNaN(this.defaultTimeout)) {
      throw new _errors.KinveyError('Invalid default timeout. Default timeout must be a number.');
    }

    if (this.defaultTimeout < 0) {
      _utils.Log.info('Default timeout is less than 0. Setting default timeout to 60000ms.');
      this.defaultTimeout = 60000;
    }

    Object.freeze(this);
  }

  _createClass(Client, [{
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