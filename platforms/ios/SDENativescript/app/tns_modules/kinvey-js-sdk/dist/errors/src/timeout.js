'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _base = require('./base');

var _base2 = _interopRequireDefault(_base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function TimeoutError(message, debug, code, kinveyRequestId) {
  this.name = 'TimeoutError';
  this.message = message || 'The request timed out.';
  this.debug = debug || undefined;
  this.code = code || undefined;
  this.kinveyRequestId = kinveyRequestId || undefined;
  this.stack = new Error().stack;
}
TimeoutError.prototype = Object.create(_base2.default.prototype);
TimeoutError.prototype.constructor = TimeoutError;
exports.default = TimeoutError;