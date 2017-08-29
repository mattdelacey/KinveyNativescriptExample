'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _base = require('./base');

var _base2 = _interopRequireDefault(_base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function MissingRequestParameterError(message, debug, code, kinveyRequestId) {
  this.name = 'MissingRequestParameterError';
  this.message = message || 'A required parameter is missing from the request.';
  this.debug = debug || undefined;
  this.code = code || undefined;
  this.kinveyRequestId = kinveyRequestId || undefined;
  this.stack = new Error().stack;
}
MissingRequestParameterError.prototype = Object.create(_base2.default.prototype);
MissingRequestParameterError.prototype.constructor = MissingRequestParameterError;
exports.default = MissingRequestParameterError;