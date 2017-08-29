'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _base = require('./base');

var _base2 = _interopRequireDefault(_base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function MissingRequestHeaderError(message, debug, code, kinveyRequestId) {
  this.name = 'MissingRequestHeaderError';
  this.message = message || 'The request is missing a required header.';
  this.debug = debug || undefined;
  this.code = code || undefined;
  this.kinveyRequestId = kinveyRequestId || undefined;
  this.stack = new Error().stack;
}
MissingRequestHeaderError.prototype = Object.create(_base2.default.prototype);
MissingRequestHeaderError.prototype.constructor = MissingRequestHeaderError;
exports.default = MissingRequestHeaderError;