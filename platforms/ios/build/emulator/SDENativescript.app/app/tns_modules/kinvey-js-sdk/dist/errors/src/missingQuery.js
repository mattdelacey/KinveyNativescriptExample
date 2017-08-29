'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _base = require('./base');

var _base2 = _interopRequireDefault(_base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function MissingQueryError(message, debug, code, kinveyRequestId) {
  this.name = 'MissingQueryError';
  this.message = message || 'The request is missing a query string.';
  this.debug = debug || undefined;
  this.code = code || undefined;
  this.kinveyRequestId = kinveyRequestId || undefined;
  this.stack = new Error().stack;
}
MissingQueryError.prototype = Object.create(_base2.default.prototype);
MissingQueryError.prototype.constructor = MissingQueryError;
exports.default = MissingQueryError;