'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _base = require('./base');

var _base2 = _interopRequireDefault(_base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function JSONParseError(message, debug, code, kinveyRequestId) {
  this.name = 'JSONParseError';
  this.message = message || 'Unable to parse the JSON in the request.';
  this.debug = debug || undefined;
  this.code = code || undefined;
  this.kinveyRequestId = kinveyRequestId || undefined;
  this.stack = new Error().stack;
}
JSONParseError.prototype = Object.create(_base2.default.prototype);
JSONParseError.prototype.constructor = JSONParseError;
exports.default = JSONParseError;