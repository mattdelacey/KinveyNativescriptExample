'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _base = require('./base');

var _base2 = _interopRequireDefault(_base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function InvalidQuerySyntaxError(message, debug, code, kinveyRequestId) {
  this.name = 'InvalidQuerySyntaxError';
  this.message = message || 'The query string in the request has an invalid syntax.';
  this.debug = debug || undefined;
  this.code = code || undefined;
  this.kinveyRequestId = kinveyRequestId || undefined;
  this.stack = new Error().stack;
}
InvalidQuerySyntaxError.prototype = Object.create(_base2.default.prototype);
InvalidQuerySyntaxError.prototype.constructor = InvalidQuerySyntaxError;
exports.default = InvalidQuerySyntaxError;