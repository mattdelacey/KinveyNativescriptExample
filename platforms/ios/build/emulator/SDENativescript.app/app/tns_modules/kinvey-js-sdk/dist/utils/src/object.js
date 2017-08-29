'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isDefined = isDefined;
exports.nested = nested;

var _isNull = require('lodash/isNull');

var _isNull2 = _interopRequireDefault(_isNull);

var _isUndefined = require('lodash/isUndefined');

var _isUndefined2 = _interopRequireDefault(_isUndefined);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function isDefined(obj) {
  return (0, _isUndefined2.default)(obj) === false && (0, _isNull2.default)(obj) === false;
}

function nested(obj, dotProperty, value) {
  if (isDefined(dotProperty) === false) {
    obj = value || obj;
    return obj;
  }

  var parts = dotProperty.split('.');
  var current = parts.shift();
  while (current && obj) {
    obj = obj[current];
    current = parts.shift();
  }

  return value || obj;
}