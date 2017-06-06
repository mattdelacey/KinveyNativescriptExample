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

var storage = new _fastMemoryCache2.default();
var ActiveUserHelper = {
  get: function get() {
    var client = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _client2.default.sharedInstance();

    var value = storage.get(client.appKey);

    try {
      value = JSON.parse(value);
    } catch (e) {}

    return value;
  },
  set: function set() {
    var client = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _client2.default.sharedInstance();
    var activeUser = arguments[1];

    this.remove(client);

    if ((0, _utils.isDefined)(activeUser)) {
      storage.set(client.appKey, JSON.stringify(activeUser));
    }

    return activeUser;
  },
  remove: function remove() {
    var client = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _client2.default.sharedInstance();

    if ((0, _isFunction2.default)(storage.remove)) {
      storage.remove(client.appKey);
    } else if ((0, _isFunction2.default)(storage.delete)) {
      storage.delete(client.appKey);
    }
  },
  useStorage: function useStorage(StorageClass) {
    storage = new StorageClass();
  }
};

exports.ActiveUserHelper = ActiveUserHelper;