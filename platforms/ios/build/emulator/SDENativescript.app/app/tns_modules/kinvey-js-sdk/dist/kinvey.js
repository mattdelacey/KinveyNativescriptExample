'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Kinvey = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _es6Promise = require('es6-promise');

var _es6Promise2 = _interopRequireDefault(_es6Promise);

var _errors = require('./errors');

var _utils = require('./utils');

var _client = require('./client');

var _client2 = _interopRequireDefault(_client);

var _endpoint = require('./endpoint');

var _endpoint2 = _interopRequireDefault(_endpoint);

var _query = require('./query');

var _query2 = _interopRequireDefault(_query);

var _aggregation = require('./aggregation');

var _aggregation2 = _interopRequireDefault(_aggregation);

var _datastore = require('./datastore');

var _datastore2 = _interopRequireDefault(_datastore);

var _entity = require('./entity');

var _identity = require('./identity');

var _request = require('./request');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Kinvey = function () {
  function Kinvey() {
    _classCallCheck(this, Kinvey);
  }

  _createClass(Kinvey, null, [{
    key: 'initialize',
    value: function initialize(config) {
      var client = Kinvey.init(config);
      return _es6Promise2.default.resolve(client.getActiveUser());
    }
  }, {
    key: 'init',
    value: function init() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      if ((0, _utils.isDefined)(options.appKey) === false) {
        throw new _errors.KinveyError('No App Key was provided.' + ' Unable to create a new Client without an App Key.');
      }

      if ((0, _utils.isDefined)(options.appSecret) === false && (0, _utils.isDefined)(options.masterSecret) === false) {
        throw new _errors.KinveyError('No App Secret or Master Secret was provided.' + ' Unable to create a new Client without an App Secret.');
      }

      return _client2.default.init(options);
    }
  }, {
    key: 'ping',
    value: function ping() {
      var client = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _client2.default.sharedInstance();

      var request = new _request.KinveyRequest({
        method: _request.RequestMethod.GET,
        authType: _request.AuthType.All,
        url: this.client.apiHostname + '/appdata/' + client.appKey
      });

      return request.execute().then(function (response) {
        return response.data;
      });
    }
  }, {
    key: 'client',
    get: function get() {
      return _client2.default.sharedInstance();
    }
  }, {
    key: 'appVersion',
    get: function get() {
      return this.client.appVersion;
    },
    set: function set(appVersion) {
      this.client.appVersion = appVersion;
    }
  }]);

  return Kinvey;
}();

Kinvey.Acl = _entity.Acl;
Kinvey.Aggregation = _aggregation2.default;
Kinvey.AuthorizationGrant = _identity.AuthorizationGrant;
Kinvey.CustomEndpoint = _endpoint2.default;
Kinvey.DataStore = _datastore2.default;
Kinvey.DataStoreType = _datastore.DataStoreType;
Kinvey.Files = new _datastore.FileStore();
Kinvey.Group = _aggregation2.default;
Kinvey.Log = _utils.Log;
Kinvey.Metadata = _entity.Metadata;
Kinvey.Query = _query2.default;
Kinvey.SyncOperation = _datastore.SyncOperation;
Kinvey.User = _entity.User;

Kinvey.ActiveUserError = _errors.ActiveUserError;
Kinvey.APIVersionNotAvailableError = _errors.APIVersionNotAvailableError;
Kinvey.APIVersionNotImplementedError = _errors.APIVersionNotImplementedError;
Kinvey.AppProblemError = _errors.AppProblemError;
Kinvey.BadRequestError = _errors.BadRequestError;
Kinvey.BLError = _errors.BLError;
Kinvey.CORSDisabledError = _errors.CORSDisabledError;
Kinvey.DuplicateEndUsersError = _errors.DuplicateEndUsersError;
Kinvey.FeatureUnavailableError = _errors.FeatureUnavailableError;
Kinvey.IncompleteRequestBodyError = _errors.IncompleteRequestBodyError;
Kinvey.IndirectCollectionAccessDisallowedError = _errors.IndirectCollectionAccessDisallowedError;
Kinvey.InsufficientCredentialsError = _errors.InsufficientCredentialsError;
Kinvey.InvalidCredentialsError = _errors.InvalidCredentialsError;
Kinvey.InvalidIdentifierError = _errors.InvalidIdentifierError;
Kinvey.InvalidQuerySyntaxError = _errors.InvalidQuerySyntaxError;
Kinvey.JSONParseError = _errors.JSONParseError;
Kinvey.KinveyError = _errors.KinveyError;
Kinvey.KinveyInternalErrorRetry = _errors.KinveyInternalErrorRetry;
Kinvey.KinveyInternalErrorStop = _errors.KinveyInternalErrorStop;
Kinvey.MissingQueryError = _errors.MissingQueryError;
Kinvey.MissingRequestHeaderError = _errors.MissingRequestHeaderError;
Kinvey.MissingRequestParameterError = _errors.MissingRequestParameterError;
Kinvey.MobileIdentityConnectError = _errors.MobileIdentityConnectError;
Kinvey.NoActiveUserError = _errors.NoActiveUserError;
Kinvey.NetworkConnectionError = _errors.NetworkConnectionError;
Kinvey.NoResponseError = _errors.NoResponseError;
Kinvey.NotFoundError = _errors.NotFoundError;
Kinvey.ParameterValueOutOfRangeError = _errors.ParameterValueOutOfRangeError;
Kinvey.PopupError = _errors.PopupError;
Kinvey.QueryError = _errors.QueryError;
Kinvey.ServerError = _errors.ServerError;
Kinvey.StaleRequestError = _errors.StaleRequestError;
Kinvey.SyncError = _errors.SyncError;
Kinvey.TimeoutError = _errors.TimeoutError;
Kinvey.UserAlreadyExistsError = _errors.UserAlreadyExistsError;
Kinvey.WritesToCollectionDisallowedError = _errors.WritesToCollectionDisallowedError;

Kinvey.CacheRack = _request.CacheRack;
Kinvey.NetworkRack = _request.NetworkRack;
Kinvey.Rack = _request.Rack;

exports.Kinvey = Kinvey;
exports.default = Kinvey;