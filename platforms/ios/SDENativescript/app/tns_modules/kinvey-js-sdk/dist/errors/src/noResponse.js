'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _base = require('./base');

var _base2 = _interopRequireDefault(_base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function NoResponseError(message, debug, code, kinveyRequestId) {
  this.name = 'NoResponseError';
  this.message = message || 'No response was provided.';
  this.debug = debug || undefined;
  this.code = code || undefined;
  this.kinveyRequestId = kinveyRequestId || undefined;
  this.stack = new Error().stack;
}
NoResponseError.prototype = Object.create(_base2.default.prototype);
NoResponseError.prototype.constructor = NoResponseError;
exports.default = NoResponseError;