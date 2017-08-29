'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NetworkRack = exports.CacheRack = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _es6Promise = require('es6-promise');

var _es6Promise2 = _interopRequireDefault(_es6Promise);

var _reduce = require('lodash/reduce');

var _reduce2 = _interopRequireDefault(_reduce);

var _isFunction = require('lodash/isFunction');

var _isFunction2 = _interopRequireDefault(_isFunction);

var _utils = require('../../utils');

var _values = require('lodash/values');

var _values2 = _interopRequireDefault(_values);

var _middleware = require('./middleware');

var _middleware2 = _interopRequireDefault(_middleware);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Rack = function (_Middleware) {
  _inherits(Rack, _Middleware);

  function Rack() {
    var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'Rack';

    _classCallCheck(this, Rack);

    var _this = _possibleConstructorReturn(this, (Rack.__proto__ || Object.getPrototypeOf(Rack)).call(this, name));

    _this.middlewares = [];
    _this.canceled = false;
    _this.activeMiddleware = undefined;
    return _this;
  }

  _createClass(Rack, [{
    key: 'use',
    value: function use(middleware) {
      if ((0, _utils.isDefined)(middleware)) {
        if (middleware instanceof _middleware2.default) {
          this.middlewares.push(middleware);
          return;
        }

        throw new Error('Unable to use the middleware. It must be an instance of Middleware.');
      }
    }
  }, {
    key: 'reset',
    value: function reset() {
      this.middlewares = [];
    }
  }, {
    key: 'execute',
    value: function execute(req) {
      var _this2 = this;

      if ((0, _utils.isDefined)(req) === false) {
        return _es6Promise2.default.reject(new Error('Request is undefined. Please provide a valid request.'));
      }

      return (0, _reduce2.default)((0, _values2.default)(this.middlewares), function (promise, middleware) {
        return promise.then(function (_ref) {
          var request = _ref.request,
              response = _ref.response;

          if (_this2.canceled) {
            return _es6Promise2.default.reject(new Error('Cancelled'));
          }

          _this2.activeMiddleware = middleware;
          return middleware.handle(request || req, response);
        });
      }, _es6Promise2.default.resolve({ request: req })).then(function (_ref2) {
        var response = _ref2.response;

        if (_this2.canceled === true) {
          return _es6Promise2.default.reject(new Error('Cancelled'));
        }

        _this2.canceled = false;
        _this2.activeMiddleware = undefined;
        return response;
      }).catch(function (error) {
        _this2.canceled = false;
        _this2.activeMiddleware = undefined;
        throw error;
      });
    }
  }, {
    key: 'cancel',
    value: function cancel() {
      this.canceled = true;

      if ((0, _utils.isDefined)(this.activeMiddleware) && (0, _isFunction2.default)(this.activeMiddleware.cancel)) {
        return this.activeMiddleware.cancel();
      }

      return _es6Promise2.default.resolve();
    }
  }, {
    key: 'handle',
    value: function handle(request) {
      return this.execute(request);
    }
  }, {
    key: 'generateTree',
    value: function generateTree() {
      var level = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

      var root = _get(Rack.prototype.__proto__ || Object.getPrototypeOf(Rack.prototype), 'generateTree', this).call(this, level);

      (0, _values2.default)(this.middlewares).forEach(function (middleware) {
        root.nodes.push(middleware.generateTree(level + 1));
      });

      return root;
    }
  }]);

  return Rack;
}(_middleware2.default);

exports.default = Rack;

var CacheRack = function (_Rack) {
  _inherits(CacheRack, _Rack);

  function CacheRack() {
    var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'Cache Rack';

    _classCallCheck(this, CacheRack);

    var _this3 = _possibleConstructorReturn(this, (CacheRack.__proto__ || Object.getPrototypeOf(CacheRack)).call(this, name));

    _this3.use(new _middleware.CacheMiddleware());
    return _this3;
  }

  _createClass(CacheRack, [{
    key: 'useCacheMiddleware',
    value: function useCacheMiddleware(cacheMiddleware) {
      this.reset();
      this.use(cacheMiddleware);
    }
  }, {
    key: 'execute',
    value: function execute(request) {
      _utils.Log.debug('Executing cache request', request);
      return _get(CacheRack.prototype.__proto__ || Object.getPrototypeOf(CacheRack.prototype), 'execute', this).call(this, request).then(function (response) {
        _utils.Log.debug('Received response for cache request id: ' + request.id, response);
        return response;
      }).catch(function (error) {
        _utils.Log.error('Received error for cache request id: ' + request.id, error);
        throw error;
      });
    }
  }]);

  return CacheRack;
}(Rack);

var cacheRack = new CacheRack();
exports.CacheRack = cacheRack;

var NetworkRack = function (_Rack2) {
  _inherits(NetworkRack, _Rack2);

  function NetworkRack() {
    var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'Network Rack';

    _classCallCheck(this, NetworkRack);

    var _this4 = _possibleConstructorReturn(this, (NetworkRack.__proto__ || Object.getPrototypeOf(NetworkRack)).call(this, name));

    _this4.use(new _middleware.SerializeMiddleware());
    _this4.use(new _middleware.HttpMiddleware());
    _this4.use(new _middleware.ParseMiddleware());
    return _this4;
  }

  _createClass(NetworkRack, [{
    key: 'useHttpMiddleware',
    value: function useHttpMiddleware(httpMiddleware) {
      this.reset();
      this.use(new _middleware.SerializeMiddleware());
      this.use(httpMiddleware);
      this.use(new _middleware.ParseMiddleware());
    }
  }, {
    key: 'execute',
    value: function execute(request) {
      _utils.Log.debug('Executing network request', request);
      return _get(NetworkRack.prototype.__proto__ || Object.getPrototypeOf(NetworkRack.prototype), 'execute', this).call(this, request).then(function (response) {
        _utils.Log.debug('Received response for network request: ' + request.id, response);
        return response;
      }).catch(function (error) {
        _utils.Log.error('Received error for network request id: ' + request.id, error);
        throw error;
      });
    }
  }]);

  return NetworkRack;
}(Rack);

var networkRack = new NetworkRack();
exports.NetworkRack = networkRack;