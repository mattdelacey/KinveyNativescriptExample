'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WritesToCollectionDisallowedError = exports.UserAlreadyExistsError = exports.TimeoutError = exports.SyncError = exports.StaleRequestError = exports.ServerError = exports.QueryError = exports.PopupError = exports.ParameterValueOutOfRangeError = exports.NotFoundError = exports.NoResponseError = exports.NoActiveUserError = exports.NetworkConnectionError = exports.MobileIdentityConnectError = exports.MissingRequestParameterError = exports.MissingRequestHeaderError = exports.MissingQueryError = exports.KinveyError = exports.KinveyInternalErrorStop = exports.KinveyInternalErrorRetry = exports.JSONParseError = exports.InvalidQuerySyntaxError = exports.InvalidIdentifierError = exports.InvalidCredentialsError = exports.InsufficientCredentialsError = exports.IndirectCollectionAccessDisallowedError = exports.IncompleteRequestBodyError = exports.FeatureUnavailableError = exports.DuplicateEndUsersError = exports.CORSDisabledError = exports.BLError = exports.BaseError = exports.BadRequestError = exports.AppProblemError = exports.APIVersionNotImplementedError = exports.APIVersionNotAvailableError = exports.ActiveUserError = undefined;

var _activeUser = require('./src/activeUser');

var _activeUser2 = _interopRequireDefault(_activeUser);

var _apiVersionNotAvailable = require('./src/apiVersionNotAvailable');

var _apiVersionNotAvailable2 = _interopRequireDefault(_apiVersionNotAvailable);

var _apiVersionNotImplemented = require('./src/apiVersionNotImplemented');

var _apiVersionNotImplemented2 = _interopRequireDefault(_apiVersionNotImplemented);

var _appProblem = require('./src/appProblem');

var _appProblem2 = _interopRequireDefault(_appProblem);

var _badRequest = require('./src/badRequest');

var _badRequest2 = _interopRequireDefault(_badRequest);

var _base = require('./src/base');

var _base2 = _interopRequireDefault(_base);

var _bl = require('./src/bl');

var _bl2 = _interopRequireDefault(_bl);

var _corsDisabled = require('./src/corsDisabled');

var _corsDisabled2 = _interopRequireDefault(_corsDisabled);

var _duplicateEndUsers = require('./src/duplicateEndUsers');

var _duplicateEndUsers2 = _interopRequireDefault(_duplicateEndUsers);

var _featureUnavailable = require('./src/featureUnavailable');

var _featureUnavailable2 = _interopRequireDefault(_featureUnavailable);

var _incompleteRequestBody = require('./src/incompleteRequestBody');

var _incompleteRequestBody2 = _interopRequireDefault(_incompleteRequestBody);

var _indirectCollectionAccessDisallowed = require('./src/indirectCollectionAccessDisallowed');

var _indirectCollectionAccessDisallowed2 = _interopRequireDefault(_indirectCollectionAccessDisallowed);

var _insufficientCredentials = require('./src/insufficientCredentials');

var _insufficientCredentials2 = _interopRequireDefault(_insufficientCredentials);

var _invalidCredentials = require('./src/invalidCredentials');

var _invalidCredentials2 = _interopRequireDefault(_invalidCredentials);

var _invalidIdentifier = require('./src/invalidIdentifier');

var _invalidIdentifier2 = _interopRequireDefault(_invalidIdentifier);

var _invalidQuerySyntax = require('./src/invalidQuerySyntax');

var _invalidQuerySyntax2 = _interopRequireDefault(_invalidQuerySyntax);

var _jsonParse = require('./src/jsonParse');

var _jsonParse2 = _interopRequireDefault(_jsonParse);

var _kinveyInternalErrorRetry = require('./src/kinveyInternalErrorRetry');

var _kinveyInternalErrorRetry2 = _interopRequireDefault(_kinveyInternalErrorRetry);

var _kinveyInternalErrorStop = require('./src/kinveyInternalErrorStop');

var _kinveyInternalErrorStop2 = _interopRequireDefault(_kinveyInternalErrorStop);

var _kinvey = require('./src/kinvey');

var _kinvey2 = _interopRequireDefault(_kinvey);

var _missingQuery = require('./src/missingQuery');

var _missingQuery2 = _interopRequireDefault(_missingQuery);

var _missingRequestHeader = require('./src/missingRequestHeader');

var _missingRequestHeader2 = _interopRequireDefault(_missingRequestHeader);

var _missingRequestParameter = require('./src/missingRequestParameter');

var _missingRequestParameter2 = _interopRequireDefault(_missingRequestParameter);

var _mobileIdentityConnect = require('./src/mobileIdentityConnect');

var _mobileIdentityConnect2 = _interopRequireDefault(_mobileIdentityConnect);

var _networkConnection = require('./src/networkConnection');

var _networkConnection2 = _interopRequireDefault(_networkConnection);

var _noActiveUser = require('./src/noActiveUser');

var _noActiveUser2 = _interopRequireDefault(_noActiveUser);

var _noResponse = require('./src/noResponse');

var _noResponse2 = _interopRequireDefault(_noResponse);

var _notFound = require('./src/notFound');

var _notFound2 = _interopRequireDefault(_notFound);

var _parameterValueOutOfRange = require('./src/parameterValueOutOfRange');

var _parameterValueOutOfRange2 = _interopRequireDefault(_parameterValueOutOfRange);

var _popup = require('./src/popup');

var _popup2 = _interopRequireDefault(_popup);

var _query = require('./src/query');

var _query2 = _interopRequireDefault(_query);

var _server = require('./src/server');

var _server2 = _interopRequireDefault(_server);

var _staleRequest = require('./src/staleRequest');

var _staleRequest2 = _interopRequireDefault(_staleRequest);

var _sync = require('./src/sync');

var _sync2 = _interopRequireDefault(_sync);

var _timeout = require('./src/timeout');

var _timeout2 = _interopRequireDefault(_timeout);

var _userAlreadyExists = require('./src/userAlreadyExists');

var _userAlreadyExists2 = _interopRequireDefault(_userAlreadyExists);

var _writesToCollectionDisallowed = require('./src/writesToCollectionDisallowed');

var _writesToCollectionDisallowed2 = _interopRequireDefault(_writesToCollectionDisallowed);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.ActiveUserError = _activeUser2.default;
exports.APIVersionNotAvailableError = _apiVersionNotAvailable2.default;
exports.APIVersionNotImplementedError = _apiVersionNotImplemented2.default;
exports.AppProblemError = _appProblem2.default;
exports.BadRequestError = _badRequest2.default;
exports.BaseError = _base2.default;
exports.BLError = _bl2.default;
exports.CORSDisabledError = _corsDisabled2.default;
exports.DuplicateEndUsersError = _duplicateEndUsers2.default;
exports.FeatureUnavailableError = _featureUnavailable2.default;
exports.IncompleteRequestBodyError = _incompleteRequestBody2.default;
exports.IndirectCollectionAccessDisallowedError = _indirectCollectionAccessDisallowed2.default;
exports.InsufficientCredentialsError = _insufficientCredentials2.default;
exports.InvalidCredentialsError = _invalidCredentials2.default;
exports.InvalidIdentifierError = _invalidIdentifier2.default;
exports.InvalidQuerySyntaxError = _invalidQuerySyntax2.default;
exports.JSONParseError = _jsonParse2.default;
exports.KinveyInternalErrorRetry = _kinveyInternalErrorRetry2.default;
exports.KinveyInternalErrorStop = _kinveyInternalErrorStop2.default;
exports.KinveyError = _kinvey2.default;
exports.MissingQueryError = _missingQuery2.default;
exports.MissingRequestHeaderError = _missingRequestHeader2.default;
exports.MissingRequestParameterError = _missingRequestParameter2.default;
exports.MobileIdentityConnectError = _mobileIdentityConnect2.default;
exports.NetworkConnectionError = _networkConnection2.default;
exports.NoActiveUserError = _noActiveUser2.default;
exports.NoResponseError = _noResponse2.default;
exports.NotFoundError = _notFound2.default;
exports.ParameterValueOutOfRangeError = _parameterValueOutOfRange2.default;
exports.PopupError = _popup2.default;
exports.QueryError = _query2.default;
exports.ServerError = _server2.default;
exports.StaleRequestError = _staleRequest2.default;
exports.SyncError = _sync2.default;
exports.TimeoutError = _timeout2.default;
exports.UserAlreadyExistsError = _userAlreadyExists2.default;
exports.WritesToCollectionDisallowedError = _writesToCollectionDisallowed2.default;
exports.default = _kinvey2.default;