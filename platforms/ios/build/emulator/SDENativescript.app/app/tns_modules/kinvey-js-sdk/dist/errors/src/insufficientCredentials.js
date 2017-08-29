'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _base = require('./base');

var _base2 = _interopRequireDefault(_base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function InsufficientCredentialsError(message, debug, code, kinveyRequestId) {
  this.name = 'InsufficientCredentialsError';
  this.message = message || 'The credentials used to authenticate this request are not authorized to run this operation. Please retry your request with appropriate credentials.';
  this.debug = debug || undefined;
  this.code = code || undefined;
  this.kinveyRequestId = kinveyRequestId || undefined;
  this.stack = new Error().stack;
}
InsufficientCredentialsError.prototype = Object.create(_base2.default.prototype);
InsufficientCredentialsError.prototype.constructor = InsufficientCredentialsError;
exports.default = InsufficientCredentialsError;