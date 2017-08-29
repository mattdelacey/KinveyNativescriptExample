'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Storage = exports.MemoryAdapter = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _es6Promise = require('es6-promise');

var _es6Promise2 = _interopRequireDefault(_es6Promise);

var _isString = require('lodash/isString');

var _isString2 = _interopRequireDefault(_isString);

var _isArray = require('lodash/isArray');

var _isArray2 = _interopRequireDefault(_isArray);

var _utils = require('../../../../../utils');

var _errors = require('../../../../../errors');

var _memory = require('./memory');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var queue = new _utils.Queue(1, Infinity);

exports.MemoryAdapter = _memory.MemoryAdapter;

var Storage = exports.Storage = function () {
  function Storage(name) {
    _classCallCheck(this, Storage);

    if (!name) {
      throw new _errors.KinveyError('Unable to create a Storage instance without a name.');
    }

    if (!(0, _isString2.default)(name)) {
      throw new _errors.KinveyError('The name is not a string. A name must be a string to create a Storage instance.');
    }

    this.name = name;
  }

  _createClass(Storage, [{
    key: 'loadAdapter',
    value: function loadAdapter() {
      var _this = this;

      return _es6Promise2.default.resolve().then(function () {
        return _memory.MemoryAdapter.load(_this.name);
      }).then(function (adapter) {
        if (!(0, _utils.isDefined)(adapter)) {
          return _es6Promise2.default.reject(new _errors.KinveyError('Unable to load a storage adapter.'));
        }

        return adapter;
      });
    }
  }, {
    key: 'generateObjectId',
    value: function generateObjectId() {
      var length = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 24;

      var chars = 'abcdef0123456789';
      var objectId = '';

      for (var i = 0, j = chars.length; i < length; i += 1) {
        var pos = Math.floor(Math.random() * j);
        objectId += chars.substring(pos, pos + 1);
      }

      return objectId;
    }
  }, {
    key: 'find',
    value: function find(collection) {
      return this.loadAdapter().then(function (adapter) {
        _utils.Log.debug('Find all the entities stored in the ' + collection + ' collection.', adapter);
        return adapter.find(collection);
      }).catch(function (error) {
        _utils.Log.error('Unable to find all the entities stored in the ' + collection + ' collection.', error);
        if (error instanceof _errors.NotFoundError || error.code === 404) {
          return [];
        }

        return _es6Promise2.default.reject(error);
      }).then(function () {
        var entities = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
        return entities;
      });
    }
  }, {
    key: 'findById',
    value: function findById(collection, id) {
      if (!(0, _isString2.default)(id)) {
        var error = new _errors.KinveyError('id must be a string', id);
        _utils.Log.error('Unable to find an entity with id ' + id + ' stored in the ' + collection + ' collection.', error.message);
        return _es6Promise2.default.reject(error);
      }

      return this.loadAdapter().then(function (adapter) {
        _utils.Log.debug('Find an entity with id ' + id + ' stored in the ' + collection + ' collection.', adapter);
        return adapter.findById(collection, id);
      });
    }
  }, {
    key: 'save',
    value: function save(collection) {
      var _this2 = this;

      var entities = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

      return queue.add(function () {
        var singular = false;

        if ((0, _utils.isDefined)(entities) === false) {
          return _es6Promise2.default.resolve(null);
        }

        if (!(0, _isArray2.default)(entities)) {
          singular = true;
          entities = [entities];
        }

        entities = entities.map(function (entity) {
          if (!(0, _utils.isDefined)(entity._id)) {
            var kmd = entity._kmd || {};
            kmd.local = true;
            entity._kmd = kmd;
            entity._id = _this2.generateObjectId();
          }

          return entity;
        });

        return _this2.loadAdapter().then(function (adapter) {
          return adapter.save(collection, entities);
        }).then(function (entities) {
          if (singular && entities.length > 0) {
            return entities[0];
          }

          return entities;
        });
      });
    }
  }, {
    key: 'remove',
    value: function remove(collection) {
      var _this3 = this;

      var entities = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

      return _es6Promise2.default.all(entities.map(function (entity) {
        if (!(0, _utils.isDefined)(entity._id)) {
          return _es6Promise2.default.reject(new _errors.KinveyError('Unable to remove this entity because it does not have _id.'));
        }

        return _this3.removeById(collection, entity._id);
      })).then(function (results) {
        return results.reduce(function (response, result) {
          response.count += result.count;
          return response;
        }, { count: 0 });
      });
    }
  }, {
    key: 'removeById',
    value: function removeById(collection, id) {
      var _this4 = this;

      return queue.add(function () {
        if (!(0, _isString2.default)(id)) {
          return _es6Promise2.default.reject(new _errors.KinveyError('id must be a string', id));
        }

        return _this4.loadAdapter().then(function (adapter) {
          return adapter.removeById(collection, id);
        });
      });
    }
  }, {
    key: 'clear',
    value: function clear() {
      var _this5 = this;

      return queue.add(function () {
        return _this5.loadAdapter().then(function (adapter) {
          return adapter.clear();
        });
      });
    }
  }]);

  return Storage;
}();