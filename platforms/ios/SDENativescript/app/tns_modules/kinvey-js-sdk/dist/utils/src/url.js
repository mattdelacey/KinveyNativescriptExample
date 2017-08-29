'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.appendQuery = appendQuery;

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

var _qs = require('qs');

var _qs2 = _interopRequireDefault(_qs);

var _assign = require('lodash/assign');

var _assign2 = _interopRequireDefault(_assign);

var _isArray = require('lodash/isArray');

var _isArray2 = _interopRequireDefault(_isArray);

var _isPlainObject = require('lodash/isPlainObject');

var _isPlainObject2 = _interopRequireDefault(_isPlainObject);

var _isString = require('lodash/isString');

var _isString2 = _interopRequireDefault(_isString);

var _isEmpty = require('lodash/isEmpty');

var _isEmpty2 = _interopRequireDefault(_isEmpty);

var _object = require('./object');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function serialize(obj) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var prefix = arguments[2];

  var str = [];
  var useArraySyntax = false;

  if ((0, _isArray2.default)(obj) && (0, _object.isDefined)(prefix)) {
    useArraySyntax = true;
  }

  Object.keys(obj).forEach(function (prop) {
    var query = void 0;
    var val = obj[prop];

    var key = prefix ? prefix + '[' + (useArraySyntax ? '' : prop) + ']' : prop;

    if ((0, _object.isDefined)(val) === false) {
      if (options.removeNull === true) {
        return;
      }

      query = options.encodeComponents === true ? encodeURIComponent(key) : key;
    } else if ((0, _isPlainObject2.default)(val)) {
      query = serialize(val, options, key);
    } else {
      query = options.encodeComponents ? encodeURIComponent(key) + '=' + encodeURIComponent(val) : key + '=' + val;
    }

    str.push(query);
  });

  return str.join('&');
}

function appendQuery(uri, query) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var parts = _url2.default.parse(uri, true);
  var queryToAppend = (0, _isString2.default)(query) ? _qs2.default.parse(query) : query;
  var parsedQuery = (0, _assign2.default)({}, parts.query, queryToAppend);
  options = (0, _assign2.default)({ encodeComponents: true, removeNull: false }, options);
  parts.query = null;
  var queryString = serialize(parsedQuery, options);
  parts.search = (0, _object.isDefined)(queryString) && (0, _isEmpty2.default)(queryString) === false ? '?' + queryString : null;
  return _url2.default.format(parts);
}