'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _es6Promise = require('es6-promise');

var _es6Promise2 = _interopRequireDefault(_es6Promise);

var _differenceBy = require('lodash/differenceBy');

var _differenceBy2 = _interopRequireDefault(_differenceBy);

var _assign = require('lodash/assign');

var _assign2 = _interopRequireDefault(_assign);

var _keyBy = require('lodash/keyBy');

var _keyBy2 = _interopRequireDefault(_keyBy);

var _remove2 = require('lodash/remove');

var _remove3 = _interopRequireDefault(_remove2);

var _isArray = require('lodash/isArray');

var _isArray2 = _interopRequireDefault(_isArray);

var _reduce = require('lodash/reduce');

var _reduce2 = _interopRequireDefault(_reduce);

var _map = require('lodash/map');

var _map2 = _interopRequireDefault(_map);

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

var _request2 = require('../../request');

var _errors = require('../../errors');

var _query4 = require('../../query');

var _query5 = _interopRequireDefault(_query4);

var _aggregation = require('../../aggregation');

var _aggregation2 = _interopRequireDefault(_aggregation);

var _entity = require('../../entity');

var _utils = require('../../utils');

var _networkstore = require('./networkstore');

var _networkstore2 = _interopRequireDefault(_networkstore);

var _sync = require('./sync');

var _sync2 = _interopRequireDefault(_sync);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CacheStore = function (_NetworkStore) {
  _inherits(CacheStore, _NetworkStore);

  function CacheStore(collection) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, CacheStore);

    var _this = _possibleConstructorReturn(this, (CacheStore.__proto__ || Object.getPrototypeOf(CacheStore)).call(this, collection, options));

    _this.ttl = options.ttl || undefined;

    _this.syncManager = new _sync2.default(_this.collection, options);
    return _this;
  }

  _createClass(CacheStore, [{
    key: 'find',
    value: function find(query) {
      var _this2 = this;

      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      options = (0, _assign2.default)({ syncAutomatically: this.syncAutomatically }, options);
      var syncAutomatically = options.syncAutomatically === true;
      var stream = _utils.KinveyObservable.create(function (observer) {
        if (query && !(query instanceof _query5.default)) {
          return observer.error(new _errors.KinveyError('Invalid query. It must be an instance of the Query class.'));
        }

        var request = new _request2.CacheRequest({
          method: _request2.RequestMethod.GET,
          url: _url2.default.format({
            protocol: _this2.client.apiProtocol,
            host: _this2.client.apiHost,
            pathname: _this2.pathname
          }),
          properties: options.properties,
          query: query,
          timeout: options.timeout
        });

        return request.execute().then(function (response) {
          return response.data;
        }).catch(function () {
          return [];
        }).then(function () {
          var cacheEntities = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

          observer.next(cacheEntities);

          if (syncAutomatically === true) {
            return _this2.pendingSyncCount(query, options).then(function (syncCount) {
              if (syncCount > 0) {
                return _this2.push(query, options).then(function () {
                  return _this2.pendingSyncCount(query, options);
                });
              }

              return syncCount;
            }).then(function (syncCount) {
              if (syncCount > 0) {
                throw new _errors.KinveyError('Unable to fetch the entities on the backend.' + (' There are ' + syncCount + ' entities that need') + ' to be synced.');
              }

              return _get(CacheStore.prototype.__proto__ || Object.getPrototypeOf(CacheStore.prototype), 'find', _this2).call(_this2, query, options).toPromise();
            }).then(function (networkEntities) {
              var removedEntities = (0, _differenceBy2.default)(cacheEntities, networkEntities, '_id');
              var removedIds = Object.keys((0, _keyBy2.default)(removedEntities, '_id'));
              var removeQuery = new _query5.default().contains('_id', removedIds);
              return _this2.clear(removeQuery, options).then(function () {
                return networkEntities;
              });
            }).then(function (networkEntities) {
              var request = new _request2.CacheRequest({
                method: _request2.RequestMethod.PUT,
                url: _url2.default.format({
                  protocol: _this2.client.apiProtocol,
                  host: _this2.client.apiHost,
                  pathname: _this2.pathname
                }),
                properties: options.properties,
                body: networkEntities,
                timeout: options.timeout
              });
              return request.execute().then(function (response) {
                return response.data;
              });
            });
          }

          return cacheEntities;
        }).then(function (entities) {
          observer.next(entities);
        }).then(function () {
          observer.complete();
        }).catch(function (error) {
          return observer.error(error);
        });
      });

      return stream;
    }
  }, {
    key: 'findById',
    value: function findById(id) {
      var _this3 = this;

      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      options = (0, _assign2.default)({ syncAutomatically: this.syncAutomatically }, options);
      var syncAutomatically = options.syncAutomatically === true;
      var stream = _utils.KinveyObservable.create(function (observer) {
        if ((0, _utils.isDefined)(id) === false) {
          observer.next(undefined);
          return observer.complete();
        }

        var request = new _request2.CacheRequest({
          method: _request2.RequestMethod.GET,
          url: _url2.default.format({
            protocol: _this3.client.apiProtocol,
            host: _this3.client.apiHost,
            pathname: _this3.pathname + '/' + id
          }),
          properties: options.properties,
          timeout: options.timeout
        });
        return request.execute().then(function (response) {
          return response.data;
        }).catch(function () {
          return undefined;
        }).then(function (cacheEntity) {
          observer.next(cacheEntity);

          if (syncAutomatically === true) {
            var query = new _query5.default();
            query.equalTo('_id', id);
            return _this3.pendingSyncCount(query, options).then(function (syncCount) {
              if (syncCount > 0) {
                return _this3.push(query, options).then(function () {
                  return _this3.pendingSyncCount(query, options);
                });
              }

              return syncCount;
            }).then(function (syncCount) {
              if (syncCount > 0) {
                throw new _errors.KinveyError('Unable to find the entity on the backend.' + (' There are ' + syncCount + ' entities that need') + ' to be synced.');
              }
            }).then(function () {
              return _get(CacheStore.prototype.__proto__ || Object.getPrototypeOf(CacheStore.prototype), 'findById', _this3).call(_this3, id, options).toPromise();
            }).then(function (networkEntity) {
              var request = new _request2.CacheRequest({
                method: _request2.RequestMethod.PUT,
                url: _url2.default.format({
                  protocol: _this3.client.apiProtocol,
                  host: _this3.client.apiHost,
                  pathname: _this3.pathname
                }),
                properties: options.properties,
                body: networkEntity,
                timeout: options.timeout
              });
              return request.execute().then(function (response) {
                return response.data;
              });
            });
          }

          return cacheEntity;
        }).then(function (entity) {
          return observer.next(entity);
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
      var _this4 = this;

      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      options = (0, _assign2.default)({ syncAutomatically: this.syncAutomatically }, options);
      var syncAutomatically = options.syncAutomatically === true;
      var stream = _utils.KinveyObservable.create(function (observer) {
        if (!(aggregation instanceof _aggregation2.default)) {
          return observer.error(new _errors.KinveyError('Invalid aggregation. It must be an instance of the Aggregation class.'));
        }

        var request = new _request2.CacheRequest({
          method: _request2.RequestMethod.POST,
          url: _url2.default.format({
            protocol: _this4.client.apiProtocol,
            host: _this4.client.apiHost,
            pathname: _this4.pathname + '/_group'
          }),
          properties: options.properties,
          aggregation: aggregation,
          timeout: options.timeout
        });

        return request.execute().then(function (response) {
          return response.data;
        }).catch(function () {
          return [];
        }).then(function () {
          var cacheResult = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

          observer.next(cacheResult);

          if (syncAutomatically === true) {
            return _this4.pendingSyncCount(null, options).then(function (syncCount) {
              if (syncCount > 0) {
                return _this4.push(null, options).then(function () {
                  return _this4.pendingSyncCount(null, options);
                });
              }

              return syncCount;
            }).then(function (syncCount) {
              if (syncCount > 0) {
                throw new _errors.KinveyError('Unable to group entities on the backend.' + (' There are ' + syncCount + ' entities that need') + ' to be synced.');
              }

              return _get(CacheStore.prototype.__proto__ || Object.getPrototypeOf(CacheStore.prototype), 'group', _this4).call(_this4, aggregation, options).toPromise();
            });
          }

          return cacheResult;
        }).then(function (result) {
          return observer.next(result);
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
      var _this5 = this;

      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      options = (0, _assign2.default)({ syncAutomatically: this.syncAutomatically }, options);
      var syncAutomatically = options.syncAutomatically === true;
      var stream = _utils.KinveyObservable.create(function (observer) {
        if (query && !(query instanceof _query5.default)) {
          return observer.error(new _errors.KinveyError('Invalid query. It must be an instance of the Query class.'));
        }

        var request = new _request2.CacheRequest({
          method: _request2.RequestMethod.GET,
          url: _url2.default.format({
            protocol: _this5.client.apiProtocol,
            host: _this5.client.apiHost,
            pathname: _this5.pathname
          }),
          properties: options.properties,
          query: query,
          timeout: options.timeout
        });

        return request.execute().then(function (response) {
          return response.data;
        }).catch(function () {
          return [];
        }).then(function () {
          var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
          return data.length;
        }).then(function (cacheCount) {
          observer.next(cacheCount);

          if (syncAutomatically === true) {
            return _this5.pendingSyncCount(query, options).then(function (syncCount) {
              if (syncCount > 0) {
                return _this5.push(query, options).then(function () {
                  return _this5.pendingSyncCount(query, options);
                });
              }

              return syncCount;
            }).then(function (syncCount) {
              if (syncCount > 0) {
                throw new _errors.KinveyError('Unable to count entities on the backend.' + (' There are ' + syncCount + ' entities that need') + ' to be synced.');
              }
            }).then(function () {
              return _get(CacheStore.prototype.__proto__ || Object.getPrototypeOf(CacheStore.prototype), 'count', _this5).call(_this5, query, options).toPromise();
            });
          }

          return cacheCount;
        }).then(function (count) {
          return observer.next(count);
        }).then(function () {
          return observer.complete();
        }).catch(function (error) {
          return observer.error(error);
        });
      });

      return stream;
    }
  }, {
    key: 'create',
    value: function create(entity) {
      var _this6 = this;

      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      var stream = _utils.KinveyObservable.create(function (observer) {
        if ((0, _utils.isDefined)(entity) === false) {
          observer.next(null);
          return observer.complete();
        }

        if ((0, _isArray2.default)(entity)) {
          return observer.error(new _errors.KinveyError('Unable to create an array of entities.', 'Please create entities one by one.'));
        }

        var request = new _request2.CacheRequest({
          method: _request2.RequestMethod.POST,
          url: _url2.default.format({
            protocol: _this6.client.apiProtocol,
            host: _this6.client.apiHost,
            pathname: _this6.pathname
          }),
          properties: options.properties,
          body: entity,
          timeout: options.timeout
        });

        return request.execute().then(function (response) {
          return response.data;
        }).then(function (entity) {
          return _this6.syncManager.addCreateOperation(entity, options).then(function () {
            return entity;
          });
        }).then(function (entity) {
          if (_this6.syncAutomatically === true) {
            var query = new _query5.default().equalTo('_id', entity._id);
            return _this6.push(query, options).then(function (results) {
              var result = results[0];

              if ((0, _utils.isDefined)(result.error)) {
                throw result.error;
              }

              return result.entity;
            });
          }

          return entity;
        }).then(function (entity) {
          return observer.next(entity);
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
      var _this7 = this;

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
          return observer.error(new _errors.KinveyError('The entity provided does not contain an _id. An _id is required to' + ' update the entity.', entity));
        }

        var request = new _request2.CacheRequest({
          method: _request2.RequestMethod.PUT,
          url: _url2.default.format({
            protocol: _this7.client.apiProtocol,
            host: _this7.client.apiHost,
            pathname: _this7.pathname + '/' + entity._id
          }),
          properties: options.properties,
          body: entity,
          timeout: options.timeout
        });

        return request.execute().then(function (response) {
          return response.data;
        }).then(function (entity) {
          return _this7.syncManager.addUpdateOperation(entity, options).then(function () {
            return entity;
          });
        }).then(function (entity) {
          if (_this7.syncAutomatically === true) {
            var query = new _query5.default().equalTo('_id', entity._id);
            return _this7.push(query, options).then(function (results) {
              var result = results[0];

              if ((0, _utils.isDefined)(result.error)) {
                throw result.error;
              }

              return result.entity;
            });
          }

          return entity;
        }).then(function (entity) {
          return observer.next(entity);
        }).then(function () {
          return observer.complete();
        }).catch(function (error) {
          return observer.error(error);
        });
      });

      return stream.toPromise();
    }
  }, {
    key: 'remove',
    value: function remove(query) {
      var _this8 = this;

      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      var stream = _utils.KinveyObservable.create(function (observer) {
        if (query && !(query instanceof _query5.default)) {
          return observer.error(new _errors.KinveyError('Invalid query. It must be an instance of the Query class.'));
        }

        var request = new _request2.CacheRequest({
          method: _request2.RequestMethod.GET,
          url: _url2.default.format({
            protocol: _this8.client.apiProtocol,
            host: _this8.client.apiHost,
            pathname: _this8.pathname
          }),
          properties: options.properties,
          query: query,
          timeout: options.timeout
        });

        return request.execute().then(function (response) {
          return response.data;
        }).then(function () {
          var entities = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

          if (entities.length > 0) {
            return _es6Promise2.default.all((0, _map2.default)(entities, function (entity) {
              var metadata = new _entity.Metadata(entity);

              if (metadata.isLocal()) {
                var _query = new _query5.default();
                _query.equalTo('_id', entity._id);
                return _this8.clearSync(_query, options).then(function () {
                  return entity;
                });
              }

              return _this8.syncManager.addDeleteOperation(entity, options).then(function () {
                return entity;
              });
            })).then(function () {
              return entities;
            });
          }

          return entities;
        }).then(function (entities) {
          if (entities.length > 0 && _this8.syncAutomatically === true) {
            var localEntities = (0, _remove3.default)(entities, function (entity) {
              var metadata = new _entity.Metadata(entity);
              return metadata.isLocal();
            });

            var ids = Object.keys((0, _keyBy2.default)(entities, '_id'));
            var _query2 = new _query5.default().contains('_id', ids);
            return _this8.push(_query2, options).then(function (results) {
              return results.concat(localEntities);
            });
          }

          return entities;
        }).then(function (results) {
          return _es6Promise2.default.all((0, _map2.default)(results, function (result) {
            if ((0, _utils.isDefined)(result.error) === false) {
              var _request = new _request2.CacheRequest({
                method: _request2.RequestMethod.DELETE,
                url: _url2.default.format({
                  protocol: _this8.client.apiProtocol,
                  host: _this8.client.apiHost,
                  pathname: _this8.pathname + '/' + result._id
                }),
                properties: options.properties,
                authType: _request2.AuthType.Default,
                timeout: options.timeout
              });
              return _request.execute().then(function (response) {
                return response.data;
              });
            }

            return { count: 0 };
          }));
        }).then(function (results) {
          return (0, _reduce2.default)(results, function (totalResult, result) {
            totalResult.count += result.count;
            return totalResult;
          }, { count: 0 });
        }).then().then(function (result) {
          return observer.next(result);
        }).then(function () {
          return observer.complete();
        }).catch(function (error) {
          return observer.error(error);
        });
      });

      return stream.toPromise();
    }
  }, {
    key: 'removeById',
    value: function removeById(id) {
      var _this9 = this;

      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      var stream = _utils.KinveyObservable.create(function (observer) {
        if ((0, _utils.isDefined)(id) === false) {
          observer.next({ count: 0 });
          return observer.complete();
        }

        var request = new _request2.CacheRequest({
          method: _request2.RequestMethod.GET,
          url: _url2.default.format({
            protocol: _this9.client.apiProtocol,
            host: _this9.client.apiHost,
            pathname: _this9.pathname + '/' + id
          }),
          properties: options.properties,
          authType: _request2.AuthType.Default,
          timeout: options.timeout
        });

        return request.execute().then(function (response) {
          return response.data;
        }).catch(function (error) {
          if (error instanceof _errors.NotFoundError) {
            return null;
          }

          throw error;
        }).then(function (entity) {
          if ((0, _utils.isDefined)(entity)) {
            var metadata = new _entity.Metadata(entity);

            if (metadata.isLocal()) {
              var query = new _query5.default();
              query.equalTo('_id', entity._id);
              return _this9.clearSync(query, options).then(function () {
                return entity;
              });
            }

            return _this9.syncManager.addDeleteOperation(entity, options).then(function () {
              return entity;
            });
          }

          return entity;
        }).then(function (entity) {
          if (_this9.syncAutomatically === true) {
            var query = new _query5.default().equalTo('_id', entity._id);
            return _this9.push(query, options).then(function () {
              return entity;
            });
          }

          return entity;
        }).then(function (entity) {
          var request = new _request2.CacheRequest({
            method: _request2.RequestMethod.DELETE,
            url: _url2.default.format({
              protocol: _this9.client.apiProtocol,
              host: _this9.client.apiHost,
              pathname: _this9.pathname + '/' + entity._id
            }),
            properties: options.properties,
            authType: _request2.AuthType.Default,
            timeout: options.timeout
          });
          return request.execute().then(function (response) {
            return response.data;
          });
        }).then(function (result) {
          return observer.next(result);
        }).then(function () {
          return observer.complete();
        }).catch(function (error) {
          return observer.error(error);
        });
      });

      return stream.toPromise();
    }
  }, {
    key: 'clear',
    value: function clear(query) {
      var _this10 = this;

      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      var stream = _utils.KinveyObservable.create(function (observer) {
        if (query && !(query instanceof _query5.default)) {
          return observer.error(new _errors.KinveyError('Invalid query. It must be an instance of the Query class.'));
        }

        var request = new _request2.CacheRequest({
          method: _request2.RequestMethod.GET,
          url: _url2.default.format({
            protocol: _this10.client.apiProtocol,
            host: _this10.client.apiHost,
            pathname: _this10.pathname
          }),
          properties: options.properties,
          query: query,
          timeout: options.timeout
        });

        return request.execute().then(function (response) {
          return response.data;
        }).then(function () {
          var entities = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

          return _es6Promise2.default.all((0, _map2.default)(entities, function (entity) {
            return _es6Promise2.default.resolve(entity).then(function (entity) {
              var metadata = new _entity.Metadata(entity);

              if (metadata.isLocal()) {
                var _query3 = new _query5.default();
                _query3.equalTo('_id', entity._id);
                return _this10.clearSync(_query3, options).then(function () {
                  return entity;
                });
              }

              return entity;
            }).then(function (entity) {
              var request = new _request2.CacheRequest({
                method: _request2.RequestMethod.DELETE,
                url: _url2.default.format({
                  protocol: _this10.client.apiProtocol,
                  host: _this10.client.apiHost,
                  pathname: _this10.pathname + '/' + entity._id
                }),
                properties: options.properties,
                authType: _request2.AuthType.Default,
                timeout: options.timeout
              });
              return request.execute().then(function (response) {
                return response.data;
              });
            });
          }));
        }).then(function (results) {
          return (0, _reduce2.default)(results, function (totalResult, result) {
            totalResult.count += result.count;
            return totalResult;
          }, { count: 0 });
        }).then(function (result) {
          return observer.next(result);
        }).then(function () {
          return observer.complete();
        }).catch(function (error) {
          return observer.error(error);
        });
      });

      return stream.toPromise();
    }
  }, {
    key: 'pendingSyncCount',
    value: function pendingSyncCount(query, options) {
      return this.syncManager.count(query, options);
    }
  }, {
    key: 'pendingSyncEntities',
    value: function pendingSyncEntities(query, options) {
      return this.syncManager.find(query, options);
    }
  }, {
    key: 'push',
    value: function push(query, options) {
      return this.syncManager.push(query, options);
    }
  }, {
    key: 'pull',
    value: function pull(query) {
      var _this11 = this;

      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      options = (0, _assign2.default)({ useDeltaFetch: this.useDeltaFetch }, options);
      return this.syncManager.pull(query, options).then(function (entities) {
        return _this11.clear(query, options).then(function () {
          var saveRequest = new _request2.CacheRequest({
            method: _request2.RequestMethod.PUT,
            url: _url2.default.format({
              protocol: _this11.client.apiProtocol,
              host: _this11.client.apiHost,
              pathname: _this11.pathname
            }),
            properties: options.properties,
            body: entities,
            timeout: options.timeout
          });
          return saveRequest.execute();
        }).then(function () {
          return entities;
        });
      });
    }
  }, {
    key: 'sync',
    value: function sync(query, options) {
      var _this12 = this;

      options = (0, _assign2.default)({ useDeltaFetch: this.useDeltaFetch }, options);
      return this.push(query, options).then(function (push) {
        var promise = _this12.pull(query, options).then(function (pull) {
          var result = {
            push: push,
            pull: pull
          };
          return result;
        });
        return promise;
      });
    }
  }, {
    key: 'clearSync',
    value: function clearSync(query, options) {
      return this.syncManager.clear(query, options);
    }
  }, {
    key: 'syncAutomatically',
    get: function get() {
      return true;
    }
  }]);

  return CacheStore;
}(_networkstore2.default);

exports.default = CacheStore;