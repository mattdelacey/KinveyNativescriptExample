'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Queue = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _es6Promise = require('es6-promise');

var _es6Promise2 = _interopRequireDefault(_es6Promise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var noop = function noop() {};

function resolveWith(value) {
  if (value && typeof value.then === 'function') {
    return value;
  }

  return _es6Promise2.default.resolve(value);
}

var Queue = exports.Queue = function () {
  function Queue(maxPendingPromises, maxQueuedPromises) {
    _classCallCheck(this, Queue);

    this.pendingPromises = 0;
    this.maxPendingPromises = typeof maxPendingPromises !== 'undefined' ? maxPendingPromises : Infinity;
    this.maxQueuedPromises = typeof maxQueuedPromises !== 'undefined' ? maxQueuedPromises : Infinity;
    this.queue = [];
  }

  _createClass(Queue, [{
    key: 'add',
    value: function add(promiseGenerator) {
      var _this = this;

      return new _es6Promise2.default(function (resolve, reject, notify) {
        if (_this.queue.length >= _this.maxQueuedPromises) {
          reject(new Error('Queue limit reached'));
          return;
        }

        _this.queue.push({
          promiseGenerator: promiseGenerator,
          resolve: resolve,
          reject: reject,
          notify: notify || noop
        });

        _this._dequeue();
      });
    }
  }, {
    key: 'getPendingLength',
    value: function getPendingLength() {
      return this.pendingPromises;
    }
  }, {
    key: 'getQueueLength',
    value: function getQueueLength() {
      return this.queue.length;
    }
  }, {
    key: '_dequeue',
    value: function _dequeue() {
      var _this2 = this;

      if (this.pendingPromises >= this.maxPendingPromises) {
        return false;
      }

      var item = this.queue.shift();
      if (!item) {
        return false;
      }

      try {
        this.pendingPromises += 1;
        resolveWith(item.promiseGenerator()).then(function (value) {
          _this2.pendingPromises -= 1;

          item.resolve(value);
          _this2._dequeue();
        }, function (err) {
          _this2.pendingPromises -= 1;

          item.reject(err);
          _this2._dequeue();
        }, function (message) {
          item.notify(message);
        });
      } catch (err) {
        this.pendingPromises -= 1;
        item.reject(err);
        this._dequeue();
      }

      return true;
    }
  }]);

  return Queue;
}();