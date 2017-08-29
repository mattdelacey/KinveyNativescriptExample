'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _set = function set(object, property, value, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent !== null) { set(parent, property, value, receiver); } } else if ("value" in desc && desc.writable) { desc.value = value; } else { var setter = desc.set; if (setter !== undefined) { setter.call(receiver, value); } } return value; };

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _urlPattern = require('url-pattern');

var _urlPattern2 = _interopRequireDefault(_urlPattern);

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

var _cloneDeep = require('lodash/cloneDeep');

var _cloneDeep2 = _interopRequireDefault(_cloneDeep);

var _errors = require('../../errors');

var _query = require('../../query');

var _query2 = _interopRequireDefault(_query);

var _aggregation = require('../../aggregation');

var _aggregation2 = _interopRequireDefault(_aggregation);

var _utils = require('../../utils');

var _request = require('./request');

var _request2 = _interopRequireDefault(_request);

var _response = require('./response');

var _rack = require('./rack');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CacheRequest = function (_Request) {
  _inherits(CacheRequest, _Request);

  function CacheRequest() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, CacheRequest);

    var _this = _possibleConstructorReturn(this, (CacheRequest.__proto__ || Object.getPrototypeOf(CacheRequest)).call(this, options));

    _this.aggregation = options.aggregation;
    _this.query = options.query;
    _this.rack = _rack.CacheRack;
    return _this;
  }

  _createClass(CacheRequest, [{
    key: 'execute',
    value: function execute() {
      var _this2 = this;

      return _get(CacheRequest.prototype.__proto__ || Object.getPrototypeOf(CacheRequest.prototype), 'execute', this).call(this).then(function (response) {
        if (!(response instanceof _response.KinveyResponse)) {
          response = new _response.KinveyResponse({
            statusCode: response.statusCode,
            headers: response.headers,
            data: response.data
          });
        }

        if (!response.isSuccess()) {
          throw response.error;
        }

        if ((0, _utils.isDefined)(_this2.query) && (0, _utils.isDefined)(response.data)) {
          response.data = _this2.query.process(response.data);
        }

        if ((0, _utils.isDefined)(_this2.aggregation) && (0, _utils.isDefined)(response.data)) {
          response.data = _this2.aggregation.process(response.data);
        }

        return response;
      });
    }
  }, {
    key: 'toPlainObject',
    value: function toPlainObject() {
      var obj = _get(CacheRequest.prototype.__proto__ || Object.getPrototypeOf(CacheRequest.prototype), 'toPlainObject', this).call(this);
      obj.appKey = this.appKey;
      obj.collection = this.collection;
      obj.entityId = this.entityId;
      obj.encryptionKey = this.client ? this.client.encryptionKey : undefined;
      return obj;
    }
  }, {
    key: 'body',
    get: function get() {
      return this._body;
    },
    set: function set(body) {
      this._body = (0, _cloneDeep2.default)(body);
    }
  }, {
    key: 'query',
    get: function get() {
      return this._query;
    },
    set: function set(query) {
      if ((0, _utils.isDefined)(query) && !(query instanceof _query2.default)) {
        throw new _errors.KinveyError('Invalid query. It must be an instance of the Query class.');
      }

      this._query = query;
    }
  }, {
    key: 'aggregation',
    get: function get() {
      return this._aggregation;
    },
    set: function set(aggregation) {
      if ((0, _utils.isDefined)(aggregation) && !(aggregation instanceof _aggregation2.default)) {
        throw new _errors.KinveyError('Invalid aggregation. It must be an instance of the Aggregation class.');
      }

      this._aggregation = aggregation;
    }
  }, {
    key: 'url',
    get: function get() {
      return _get(CacheRequest.prototype.__proto__ || Object.getPrototypeOf(CacheRequest.prototype), 'url', this);
    },
    set: function set(urlString) {
      _set(CacheRequest.prototype.__proto__ || Object.getPrototypeOf(CacheRequest.prototype), 'url', urlString, this);
      var pathname = global.decodeURIComponent(_url2.default.parse(urlString).pathname);
      var urlParts = pathname.replace(/^\//, '').split('/');

      this.appKey = urlParts[1];
      this.collection = urlParts[2];
      this.entityId = urlParts[3];
    }
  }]);

  return CacheRequest;
}(_request2.default);

exports.default = CacheRequest;