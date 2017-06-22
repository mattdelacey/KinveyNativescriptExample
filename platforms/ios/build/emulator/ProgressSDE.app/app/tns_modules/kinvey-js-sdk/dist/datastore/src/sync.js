'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SyncOperation = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _es6Promise = require('es6-promise');

var _es6Promise2 = _interopRequireDefault(_es6Promise);

var _map = require('lodash/map');

var _map2 = _interopRequireDefault(_map);

var _result = require('lodash/result');

var _result2 = _interopRequireDefault(_result);

var _isArray = require('lodash/isArray');

var _isArray2 = _interopRequireDefault(_isArray);

var _isString = require('lodash/isString');

var _isString2 = _interopRequireDefault(_isString);

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

var _request3 = require('../../request');

var _errors = require('../../errors');

var _utils = require('../../utils');

var _client = require('../../client');

var _client2 = _interopRequireDefault(_client);

var _query = require('../../query');

var _query2 = _interopRequireDefault(_query);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var pushInProgress = new Map();

var SyncOperation = {
  Create: _request3.RequestMethod.POST,
  Update: _request3.RequestMethod.PUT,
  Delete: _request3.RequestMethod.DELETE
};
Object.freeze(SyncOperation);
exports.SyncOperation = SyncOperation;

var SyncManager = function () {
  function SyncManager(collection) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, SyncManager);

    if (!collection) {
      throw new _errors.SyncError('A collection is required.');
    }

    if (!(0, _isString2.default)(collection)) {
      throw new _errors.SyncError('Collection must be a string.');
    }

    this.collection = collection;

    this.client = options.client || _client2.default.sharedInstance();
  }

  _createClass(SyncManager, [{
    key: 'find',
    value: function find(query) {
      var _this = this;

      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      if ((0, _utils.isDefined)(query) && query instanceof _query2.default === false) {
        query = new _query2.default((0, _result2.default)(query, 'toJSON', query));
      }

      var request = new _request3.CacheRequest({
        method: _request3.RequestMethod.GET,
        url: _url2.default.format({
          protocol: this.client.apiProtocol,
          host: this.client.apiHost,
          pathname: this.backendPathname
        }),
        query: query,
        properties: options.properties,
        timeout: options.timeout,
        client: this.client
      });
      return request.execute().then(function (response) {
        return response.data;
      }).then(function (entities) {
        var syncQuery = new _query2.default();
        syncQuery.equalTo('collection', _this.collection);

        if ((0, _utils.isDefined)(query)) {
          syncQuery.contains('entityId', (0, _map2.default)(entities, function (entity) {
            return entity._id;
          }));
        }

        var request = new _request3.CacheRequest({
          method: _request3.RequestMethod.GET,
          url: _url2.default.format({
            protocol: _this.client.apiProtocol,
            host: _this.client.apiHost,
            pathname: _this.pathname
          }),
          properties: options.properties,
          query: syncQuery,
          timeout: options.timeout,
          client: _this.client
        });
        return request.execute().then(function (response) {
          return response.data;
        });
      });
    }
  }, {
    key: 'count',
    value: function count(query) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      return this.find(query, options).then(function (entities) {
        return entities.length;
      });
    }
  }, {
    key: 'addCreateOperation',
    value: function addCreateOperation(entities) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      return this.addOperation(SyncOperation.Create, entities, options);
    }
  }, {
    key: 'addUpdateOperation',
    value: function addUpdateOperation(entities) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      return this.addOperation(SyncOperation.Update, entities, options);
    }
  }, {
    key: 'addDeleteOperation',
    value: function addDeleteOperation(entities) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      return this.addOperation(SyncOperation.Delete, entities, options);
    }
  }, {
    key: 'addOperation',
    value: function addOperation() {
      var operation = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : SyncOperation.Create;

      var _this2 = this;

      var entities = arguments[1];
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      var singular = false;

      if (!(0, _isArray2.default)(entities)) {
        singular = true;
        entities = [entities];
      }

      return _es6Promise2.default.all((0, _map2.default)(entities, function (entity) {
        if (!entity) {
          return _es6Promise2.default.resolve(null);
        }

        var id = entity._id;
        if (!id) {
          return _es6Promise2.default.reject(new _errors.SyncError('An entity is missing an _id. All entities must have an _id in order to be ' + 'added to the sync table.', entity));
        }

        var query = new _query2.default().equalTo('entityId', id);
        var findRequest = new _request3.CacheRequest({
          method: _request3.RequestMethod.GET,
          url: _url2.default.format({
            protocol: _this2.client.apiProtocol,
            host: _this2.client.apiHost,
            pathname: _this2.pathname
          }),
          properties: options.properties,
          query: query,
          timeout: options.timeout
        });
        return findRequest.execute().then(function (response) {
          return response.data;
        }).then(function (entities) {
          var syncEntity = entities.length === 1 ? entities[0] : { collection: _this2.collection, state: {}, entityId: id };

          syncEntity.state = syncEntity.state || {};
          syncEntity.state.operation = operation;

          var request = new _request3.CacheRequest({
            method: _request3.RequestMethod.PUT,
            url: _url2.default.format({
              protocol: _this2.client.apiProtocol,
              host: _this2.client.apiHost,
              pathname: _this2.pathname
            }),
            properties: options.properties,
            body: syncEntity,
            timeout: options.timeout
          });
          return request.execute();
        });
      })).then(function () {
        if (singular === true) {
          return entities[0];
        }

        return entities;
      });
    }
  }, {
    key: 'pull',
    value: function pull(query) {
      var _this3 = this;

      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      if (query && !(query instanceof _query2.default)) {
        return _es6Promise2.default.reject(new _errors.SyncError('Invalid query. It must be an instance of the Query class.'));
      }

      return this.count(query).then(function (count) {
        if (count > 0) {
          return _this3.push(query).then(function () {
            return _this3.count(query);
          });
        }

        return count;
      }).then(function (count) {
        if (count > 0) {
          throw new _errors.SyncError('Unable to pull data from the network.' + (' There are ' + count + ' entities that need') + ' to be synced before data is loaded from the network.');
        }

        var config = {
          method: _request3.RequestMethod.GET,
          authType: _request3.AuthType.Default,
          url: _url2.default.format({
            protocol: _this3.client.apiProtocol,
            host: _this3.client.apiHost,
            pathname: _this3.backendPathname
          }),
          properties: options.properties,
          query: query,
          timeout: options.timeout,
          client: _this3.client
        };
        var request = new _request3.KinveyRequest(config);

        if (options.useDeltaFetch === true) {
          request = new _request3.DeltaFetchRequest(config);
        }

        return request.execute();
      }).then(function (response) {
        return response.data;
      });
    }
  }, {
    key: 'push',
    value: function push(query) {
      var _this4 = this;

      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      var batchSize = 100;
      var i = 0;

      if (pushInProgress.get(this.collection) === true) {
        return _es6Promise2.default.reject(new _errors.SyncError('Data is already being pushed to the backend.' + ' Please wait for it to complete before pushing new data to the backend.'));
      }

      pushInProgress.set(this.collection, true);

      return this.find(query).then(function (syncEntities) {
        if (syncEntities.length > 0) {
          var batchSync = function batchSync(syncResults) {
            var promise = new _es6Promise2.default(function (resolve) {
              var batch = syncEntities.slice(i, i + batchSize);
              i += batchSize;

              return _es6Promise2.default.all((0, _map2.default)(batch, function (syncEntity) {
                var entityId = syncEntity.entityId,
                    _syncEntity$state = syncEntity.state,
                    state = _syncEntity$state === undefined ? {} : _syncEntity$state;

                var operation = state.operation || state.method;

                if (operation === SyncOperation.Delete) {
                  var request = new _request3.KinveyRequest({
                    method: _request3.RequestMethod.DELETE,
                    authType: _request3.AuthType.Default,
                    url: _url2.default.format({
                      protocol: _this4.client.apiProtocol,
                      host: _this4.client.apiHost,
                      pathname: _this4.backendPathname + '/' + entityId
                    }),
                    properties: options.properties,
                    timeout: options.timeout,
                    client: _this4.client
                  });
                  return request.execute().then(function () {
                    var request = new _request3.CacheRequest({
                      method: _request3.RequestMethod.DELETE,
                      url: _url2.default.format({
                        protocol: _this4.client.apiProtocol,
                        host: _this4.client.apiHost,
                        pathname: _this4.pathname + '/' + syncEntity._id
                      }),
                      properties: options.properties,
                      timeout: options.timeout
                    });
                    return request.execute();
                  }).then(function () {
                    var result = { _id: entityId, operation: operation };
                    return result;
                  }).catch(function (error) {
                    var result = {
                      _id: entityId,
                      operation: operation,
                      error: error
                    };
                    return result;
                  });
                } else if (operation === SyncOperation.Create || operation === SyncOperation.Update) {
                  var local = false;

                  var _request = new _request3.CacheRequest({
                    method: _request3.RequestMethod.GET,
                    url: _url2.default.format({
                      protocol: _this4.client.apiProtocol,
                      host: _this4.client.apiHost,
                      pathname: _this4.backendPathname + '/' + entityId
                    }),
                    properties: options.properties,
                    timeout: options.timeout
                  });
                  return _request.execute().then(function (response) {
                    return response.data;
                  }).then(function (entity) {
                    var request = new _request3.KinveyRequest({
                      method: _request3.RequestMethod.PUT,
                      authType: _request3.AuthType.Default,
                      url: _url2.default.format({
                        protocol: _this4.client.apiProtocol,
                        host: _this4.client.apiHost,
                        pathname: _this4.backendPathname + '/' + entityId
                      }),
                      properties: options.properties,
                      timeout: options.timeout,
                      body: entity,
                      client: _this4.client
                    });

                    if (operation === SyncOperation.Create) {
                      if ((0, _utils.isDefined)(entity._kmd) && entity._kmd.local === true) {
                        local = true;
                        delete entity._id;
                      }

                      request.method = _request3.RequestMethod.POST;
                      request.url = _url2.default.format({
                        protocol: _this4.client.apiProtocol,
                        host: _this4.client.apiHost,
                        pathname: _this4.backendPathname
                      });
                    }

                    return request.execute().then(function (response) {
                      return response.data;
                    }).then(function (entity) {
                      var request = new _request3.CacheRequest({
                        method: _request3.RequestMethod.DELETE,
                        url: _url2.default.format({
                          protocol: _this4.client.apiProtocol,
                          host: _this4.client.apiHost,
                          pathname: _this4.pathname + '/' + syncEntity._id
                        }),
                        properties: options.properties,
                        timeout: options.timeout
                      });
                      return request.execute().then(function () {
                        var request = new _request3.CacheRequest({
                          method: _request3.RequestMethod.PUT,
                          url: _url2.default.format({
                            protocol: _this4.client.apiProtocol,
                            host: _this4.client.apiHost,
                            pathname: _this4.backendPathname + '/' + entity._id
                          }),
                          properties: options.properties,
                          timeout: options.timeout,
                          body: entity
                        });
                        return request.execute().then(function (response) {
                          return response.data;
                        });
                      }).then(function (entity) {
                        if (local) {
                          var _request2 = new _request3.CacheRequest({
                            method: _request3.RequestMethod.DELETE,
                            url: _url2.default.format({
                              protocol: _this4.client.apiProtocol,
                              host: _this4.client.apiHost,
                              pathname: _this4.backendPathname + '/' + entityId
                            }),
                            properties: options.properties,
                            timeout: options.timeout
                          });

                          return _request2.execute().then(function () {
                            return entity;
                          });
                        }

                        return entity;
                      }).then(function (entity) {
                        var result = {
                          _id: entityId,
                          operation: operation,
                          entity: entity
                        };
                        return result;
                      });
                    }).catch(function (error) {
                      entity._id = entityId;

                      var result = {
                        _id: entityId,
                        operation: operation,
                        entity: entity,
                        error: error
                      };
                      return result;
                    });
                  }).catch(function (error) {
                    var result = {
                      _id: entityId,
                      operation: operation,
                      entity: undefined,
                      error: error
                    };
                    return result;
                  });
                }

                return {
                  _id: entityId,
                  operation: operation,
                  entity: undefined,
                  error: new _errors.SyncError('Unable to sync the entity since the operation was not recognized.', syncEntity)
                };
              })).then(function (results) {
                syncResults = syncResults.concat(results);

                if (i < syncEntities.length) {
                  return resolve(batchSync(syncResults));
                }

                return resolve(syncResults);
              });
            });
            return promise;
          };

          return batchSync([]);
        }

        return [];
      }).then(function (result) {
        pushInProgress.set(_this4.collection, false);
        return result;
      }).catch(function (error) {
        pushInProgress.set(_this4.collection, false);
        throw error;
      });
    }
  }, {
    key: 'clear',
    value: function clear(query) {
      var _this5 = this;

      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      return this.find(query, options).then(function (entities) {
        return _es6Promise2.default.all((0, _map2.default)(entities, function (entity) {
          var request = new _request3.CacheRequest({
            method: _request3.RequestMethod.DELETE,
            url: _url2.default.format({
              protocol: _this5.client.apiProtocol,
              host: _this5.client.apiHost,
              pathname: _this5.pathname + '/' + entity._id
            }),
            properties: options.properties,
            timeout: options.timeout
          });
          return request.execute().then(function (response) {
            return response.data;
          });
        }));
      });
    }
  }, {
    key: 'pathname',
    get: function get() {
      return '/appdata/' + this.client.appKey + '/kinvey_sync';
    }
  }, {
    key: 'backendPathname',
    get: function get() {
      return '/appdata/' + this.client.appKey + '/' + this.collection;
    }
  }]);

  return SyncManager;
}();

exports.default = SyncManager;