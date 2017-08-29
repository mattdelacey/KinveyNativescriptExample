'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _base = require('./base');

var _base2 = _interopRequireDefault(_base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function InvalidCredentialsError(message, debug, code, kinveyRequestId) {
  this.name = 'InvalidCredentialsError';
  this.message = message || 'Invalid credentials. Please retry your request with correct credentials.';
  this.debug = debug || undefined;
  this.code = code || undefined;
  this.kinveyRequestId = kinveyRequestId || undefined;
  this.stack = new Error().stack;
}
InvalidCredentialsError.prototype = Object.create(_base2.default.prototype);
InvalidCredentialsError.prototype.constructor = InvalidCredentialsError;
exports.default = InvalidCredentialsError;