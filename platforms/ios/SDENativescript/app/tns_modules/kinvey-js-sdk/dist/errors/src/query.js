'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _base = require('./base');

var _base2 = _interopRequireDefault(_base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function QueryError(message, debug, code, kinveyRequestId) {
  this.name = 'QueryError';
  this.message = message || 'An error occurred with the query.';
  this.debug = debug || undefined;
  this.code = code || undefined;
  this.kinveyRequestId = kinveyRequestId || undefined;
  this.stack = new Error().stack;
}
QueryError.prototype = Object.create(_base2.default.prototype);
QueryError.prototype.constructor = QueryError;
exports.default = QueryError;