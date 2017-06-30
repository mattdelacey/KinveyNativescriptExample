'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _es6Promise = require('es6-promise');

var _es6Promise2 = _interopRequireDefault(_es6Promise);

var _isString = require('lodash/isString');

var _isString2 = _interopRequireDefault(_isString);

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

var _errors = require('./errors');

var _client = require('./client');

var _client2 = _interopRequireDefault(_client);

var _request = require('./request');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CustomEndpoint = function () {
  function CustomEndpoint() {
    _classCallCheck(this, CustomEndpoint);

    throw new _errors.KinveyError('Not allowed to create an instance of the `CustomEndpoint` class.', 'Please use `CustomEndpoint.execute()` function.');
  }

  _createClass(CustomEndpoint, null, [{
    key: 'execute',
    value: function execute(endpoint, args) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      var client = options.client || _client2.default.sharedInstance();

      if (!endpoint) {
        return _es6Promise2.default.reject(new _errors.KinveyError('An endpoint argument is required.'));
      }

      if (!(0, _isString2.default)(endpoint)) {
        return _es6Promise2.default.reject(new _errors.KinveyError('The endpoint argument must be a string.'));
      }

      var request = new _request.KinveyRequest({
        method: _request.RequestMethod.POST,
        authType: _request.AuthType.Default,
        url: _url2.default.format({
          protocol: client.apiProtocol,
          host: client.apiHost,
          pathname: '/rpc/' + client.appKey + '/custom/' + endpoint
        }),
        properties: options.properties,
        body: args,
        timeout: options.timeout,
        client: client
      });
      return request.execute().then(function (response) {
        return response.data;
      });
    }
  }]);

  return CustomEndpoint;
}();

exports.default = CustomEndpoint;