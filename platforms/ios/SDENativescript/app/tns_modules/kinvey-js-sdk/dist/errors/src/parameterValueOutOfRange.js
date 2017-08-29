'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _base = require('./base');

var _base2 = _interopRequireDefault(_base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ParameterValueOutOfRangeError(message, debug, code, kinveyRequestId) {
  this.name = 'ParameterValueOutOfRangeError';
  this.message = message || 'The value specified for one of the request parameters is out of range.';
  this.debug = debug || undefined;
  this.code = code || undefined;
  this.kinveyRequestId = kinveyRequestId || undefined;
  this.stack = new Error().stack;
}
ParameterValueOutOfRangeError.prototype = Object.create(_base2.default.prototype);
ParameterValueOutOfRangeError.prototype.constructor = ParameterValueOutOfRangeError;
exports.default = ParameterValueOutOfRangeError;