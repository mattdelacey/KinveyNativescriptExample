'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _base = require('./base');

var _base2 = _interopRequireDefault(_base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function IncompleteRequestBodyError(message, debug, code, kinveyRequestId) {
  this.name = 'IncompleteRequestBodyError';
  this.message = message || 'The request body is either missing or incomplete.';
  this.debug = debug || undefined;
  this.code = code || undefined;
  this.kinveyRequestId = kinveyRequestId || undefined;
  this.stack = new Error().stack;
}
IncompleteRequestBodyError.prototype = Object.create(_base2.default.prototype);
IncompleteRequestBodyError.prototype.constructor = IncompleteRequestBodyError;
exports.default = IncompleteRequestBodyError;