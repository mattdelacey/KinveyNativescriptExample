'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ActiveUserHelper = undefined;

var _fastMemoryCache = require('fast-memory-cache');

var _fastMemoryCache2 = _interopRequireDefault(_fastMemoryCache);

var _isFunction = require('lodash/isFunction');

var _isFunction2 = _interopRequireDefault(_isFunction);

var _client = require('../../client');

var _client2 = _interopRequireDefault(_client);

var _utils = require('../../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var memory = new _fastMemoryCache2.default();
var storage = new _fastMemoryCache2.default();

var ActiveUserHelper = {
  load: function load() {
    var _this = this;

    var client = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _client2.default.sharedInstance();

    return new Promise(function (resolve) {
      resolve(storage.get(client.appKey));
    }).then(function (value) {
      try {
        value = JSON.parse(value);
      } catch (e) {}

      return value;
    }).then(function (activeUser) {
      return _this.set(client, activeUser);
    });
  },
  get: function get() {
    var client = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _client2.default.sharedInstance();

    var value = memory.get(client.appKey);

    try {
      value = JSON.parse(value);
    } catch (e) {}

    return value;
  },
  set: function set() {
    var client = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _client2.default.sharedInstance();
    var activeUser = arguments[1];

    if ((0, _utils.isDefined)(activeUser)) {
      memory.set(client.appKey, JSON.stringify(activeUser));

      return new Promise(function (resolve) {
        resolve(storage.set(client.appKey, JSON.stringify(activeUser)));
      }).then(function () {
        return activeUser;
      });
    }

    return this.remove(client);
  },
  remove: function remove() {
    var client = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _client2.default.sharedInstance();

    memory.delete(client.appKey);

    return new Promise(function (resolve) {
      if ((0, _isFunction2.default)(storage.remove)) {
        return resolve(storage.remove(client.appKey));
      } else if ((0, _isFunction2.default)(storage.delete)) {
        return resolve(storage.delete(client.appKey));
      }

      return resolve(null);
    }).then(function () {
      return null;
    });
  },
  useStorage: function useStorage(StorageClass) {
    storage = new StorageClass();
  }
};

exports.ActiveUserHelper = ActiveUserHelper;