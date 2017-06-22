'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _isString = require('lodash/isString');

var _isString2 = _interopRequireDefault(_isString);

var _isArray = require('lodash/isArray');

var _isArray2 = _interopRequireDefault(_isArray);

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

var _request = require('../../request');

var _errors = require('../../errors');

var _query = require('../../query');

var _query2 = _interopRequireDefault(_query);

var _client = require('../../client');

var _client2 = _interopRequireDefault(_client);

var _utils = require('../../utils');

var _aggregation = require('../../aggregation');

var _aggregation2 = _interopRequireDefault(_aggregation);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var NetworkStore = function () {
  function NetworkStore(collection) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, NetworkStore);

    if (collection && !(0, _isString2.default)(collection)) {
      throw new _errors.KinveyError('Collection must be a string.');
    }

    this.collection = collection;

    this.client = options.client;

    this.useDeltaFetch = options.useDeltaFetch === true;
  }

  _createClass(NetworkStore, [{
    key: 'find',
    value: function find(query) {
      var _this = this;

      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      var useDeltaFetch = options.useDeltaFetch === true || this.useDeltaFetch;
      var stream = _utils.KinveyObservable.create(function (observer) {
        if ((0, _utils.isDefined)(query) && !(query instanceof _query2.default)) {
          return observer.error(new _errors.KinveyError('Invalid query. It must be an instance of the Query class.'));
        }

        var config = {
          method: _request.RequestMethod.GET,
          authType: _request.AuthType.Default,
          url: _url2.default.format({
            protocol: _this.client.apiProtocol,
            host: _this.client.apiHost,
            pathname: _this.pathname
          }),
          properties: options.properties,
          query: query,
          timeout: options.timeout,
          client: _this.client
        };
        var request = new _request.KinveyRequest(config);

        if (useDeltaFetch === true) {
          request = new _request.DeltaFetchRequest(config);
        }

        return request.execute().then(function (response) {
          return response.data;
        }).then(function (data) {
          return observer.next(data);
        }).then(function () {
          return observer.complete();
        }).catch(function (error) {
          return observer.error(error);
        });
      });
      return stream;
    }
  }, {
    key: 'findById',
    value: function findById(id) {
      var _this2 = this;

      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      var useDeltaFetch = options.useDeltaFetch || this.useDeltaFetch;
      var stream = _utils.KinveyObservable.create(function (observer) {
        if (!id) {
          observer.next(undefined);
          return observer.complete();
        }

        var config = {
          method: _request.RequestMethod.GET,
          authType: _request.AuthType.Default,
          url: _url2.default.format({
            protocol: _this2.client.apiProtocol,
            host: _this2.client.apiHost,
            pathname: _this2.pathname + '/' + id
          }),
          properties: options.properties,
          timeout: options.timeout,
          client: _this2.client
        };
        var request = new _request.KinveyRequest(config);

        if (useDeltaFetch === true) {
          request = new _request.DeltaFetchRequest(config);
        }

        return request.execute().then(function (response) {
          return response.data;
        }).then(function (data) {
          return observer.next(data);
        }).then(function () {
          return observer.complete();
        }).catch(function (error) {
          return observer.error(error);
        });
      });

      return stream;
    }
  }, {
    key: 'group',
    value: function group(aggregation) {
      var _this3 = this;

      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      var stream = _utils.KinveyObservable.create(function (observer) {
        if (!(aggregation instanceof _aggregation2.default)) {
          return observer.error(new _errors.KinveyError('Invalid aggregation. It must be an instance of the Aggregation class.'));
        }

        var request = new _request.KinveyRequest({
          method: _request.RequestMethod.POST,
          authType: _request.AuthType.Default,
          url: _url2.default.format({
            protocol: _this3.client.apiProtocol,
            host: _this3.client.apiHost,
            pathname: _this3.pathname + '/_group'
          }),
          properties: options.properties,
          aggregation: aggregation,
          timeout: options.timeout,
          client: _this3.client
        });

        return request.execute().then(function (response) {
          return response.data;
        }).then(function (data) {
          return observer.next(data);
        }).then(function () {
          return observer.complete();
        }).catch(function (error) {
          return observer.error(error);
        });
      });
      return stream;
    }
  }, {
    key: 'count',
    value: function count(query) {
      var _this4 = this;

      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      var stream = _utils.KinveyObservable.create(function (observer) {
        try {
          if (query && !(query instanceof _query2.default)) {
            throw new _errors.KinveyError('Invalid query. It must be an instance of the Query class.');
          }

          var request = new _request.KinveyRequest({
            method: _request.RequestMethod.GET,
            authType: _request.AuthType.Default,
            url: _url2.default.format({
              protocol: _this4.client.apiProtocol,
              host: _this4.client.apiHost,
              pathname: _this4.pathname + '/_count'
            }),
            properties: options.properties,
            query: query,
            timeout: options.timeout,
            client: _this4.client
          });

          return request.execute().then(function (response) {
            return response.data;
          }).then(function (data) {
            return observer.next(data ? data.count : 0);
          }).then(function () {
            return observer.complete();
          }).catch(function (error) {
            return observer.error(error);
          });
        } catch (error) {
          return observer.error(error);
        }
      });

      return stream;
    }
  }, {
    key: 'create',
    value: function create(entity) {
      var _this5 = this;

      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      var stream = _utils.KinveyObservable.create(function (observer) {
        if ((0, _utils.isDefined)(entity) === false) {
          observer.next(null);
          return observer.complete();
        }

        if ((0, _isArray2.default)(entity)) {
          return observer.error(new _errors.KinveyError('Unable to create an array of entities.', 'Please create entities one by one.'));
        }

        var request = new _request.KinveyRequest({
          method: _request.RequestMethod.POST,
          authType: _request.AuthType.Default,
          url: _url2.default.format({
            protocol: _this5.client.apiProtocol,
            host: _this5.client.apiHost,
            pathname: _this5.pathname
          }),
          properties: options.properties,
          data: entity,
          timeout: options.timeout,
          client: _this5.client
        });
        return request.execute().then(function (response) {
          return response.data;
        }).then(function (data) {
          return observer.next(data);
        }).then(function () {
          return observer.complete();
        }).catch(function (error) {
          return observer.error(error);
        });
      });

      return stream.toPromise();
    }
  }, {
    key: 'update',
    value: function update(entity) {
      var _this6 = this;

      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      var stream = _utils.KinveyObservable.create(function (observer) {
        if ((0, _utils.isDefined)(entity) === false) {
          observer.next(null);
          return observer.complete();
        }

        if ((0, _isArray2.default)(entity)) {
          return observer.error(new _errors.KinveyError('Unable to update an array of entities.', 'Please update entities one by one.'));
        }

        if ((0, _utils.isDefined)(entity._id) === false) {
          return observer.error(new _errors.KinveyError('Unable to update entity.', 'Entity must contain an _id to be updated.'));
        }

        var request = new _request.KinveyRequest({
          method: _request.RequestMethod.PUT,
          authType: _request.AuthType.Default,
          url: _url2.default.format({
            protocol: _this6.client.apiProtocol,
            host: _this6.client.apiHost,
            pathname: _this6.pathname + '/' + entity._id
          }),
          properties: options.properties,
          data: entity,
          timeout: options.timeout,
          client: _this6.client
        });
        return request.execute().then(function (response) {
          return response.data;
        }).then(function (data) {
          return observer.next(data);
        }).then(function () {
          return observer.complete();
        }).catch(function (error) {
          return observer.error(error);
        });
      });

      return stream.toPromise();
    }
  }, {
    key: 'save',
    value: function save(entity, options) {
      if (entity._id) {
        return this.update(entity, options);
      }

      return this.create(entity, options);
    }
  }, {
    key: 'remove',
    value: function remove(query) {
      var _this7 = this;

      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      var stream = _utils.KinveyObservable.create(function (observer) {
        try {
          if (query && !(query instanceof _query2.default)) {
            throw new _errors.KinveyError('Invalid query. It must be an instance of the Query class.');
          }

          var request = new _request.KinveyRequest({
            method: _request.RequestMethod.DELETE,
            authType: _request.AuthType.Default,
            url: _url2.default.format({
              protocol: _this7.client.apiProtocol,
              host: _this7.client.apiHost,
              pathname: _this7.pathname
            }),
            properties: options.properties,
            query: query,
            timeout: options.timeout,
            client: _this7.client
          });
          return request.execute().then(function (response) {
            return response.data;
          }).then(function (data) {
            return observer.next(data);
          }).then(function () {
            return observer.complete();
          }).catch(function (error) {
            return observer.error(error);
          });
        } catch (error) {
          return observer.error(error);
        }
      });

      return stream.toPromise();
    }
  }, {
    key: 'removeById',
    value: function removeById(id) {
      var _this8 = this;

      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      var stream = _utils.KinveyObservable.create(function (observer) {
        try {
          if ((0, _utils.isDefined)(id) === false) {
            observer.next(undefined);
            return observer.complete();
          }

          var request = new _request.KinveyRequest({
            method: _request.RequestMethod.DELETE,
            authType: _request.AuthType.Default,
            url: _url2.default.format({
              protocol: _this8.client.apiProtocol,
              host: _this8.client.apiHost,
              pathname: _this8.pathname + '/' + id
            }),
            properties: options.properties,
            timeout: options.timeout
          });
          return request.execute().then(function (response) {
            return response.data;
          }).then(function (data) {
            return observer.next(data);
          }).then(function () {
            return observer.complete();
          }).catch(function (error) {
            return observer.error(error);
          });
        } catch (error) {
          return observer.error(error);
        }
      });

      return stream.toPromise();
    }
  }, {
    key: 'subscribe',
    value: function subscribe(onNext, onError, onComplete) {
      return this.liveStream.subscribe(onNext, onError, onComplete);
    }
  }, {
    key: 'client',
    get: function get() {
      if ((0, _utils.isDefined)(this._client)) {
        return this._client;
      }

      return _client2.default.sharedInstance();
    },
    set: function set(client) {
      if (client instanceof _client2.default) {
        this._client = client;
      } else {
        this._client = null;
      }
    }
  }, {
    key: 'pathname',
    get: function get() {
      var pathname = '/appdata/' + this.client.appKey;

      if (this.collection) {
        pathname = pathname + '/' + this.collection;
      }

      return pathname;
    }
  }, {
    key: 'liveStream',
    get: function get() {
      var _this9 = this;

      if (typeof EventSource === 'undefined') {
        throw new _errors.KinveyError('Your environment does not support server-sent events.');
      }

      if (!this._liveStream) {
        var source = new EventSource('' + this.client.liveServiceHostname + this.pathname);

        this._liveStream = _utils.KinveyObservable.create(function (observer) {
          source.onopen = function (event) {
            _utils.Log.info('Subscription to Kinvey Live Service is now open at ' + source.url + '.');
            _utils.Log.info(event);
          };

          source.onmessage = function (message) {
            try {
              observer.next(JSON.parse(message.data));
            } catch (error) {
              observer.error(error);
            }
          };

          source.onerror = function (error) {
            observer.error(error);
          };

          return function () {
            observer.complete();
          };
        }).finally(function () {
          source.close();
          delete _this9._liveStream;
        });
      }

      return this._liveStream;
    }
  }]);

  return NetworkStore;
}();

exports.default = NetworkStore;