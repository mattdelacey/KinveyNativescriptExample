'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _base = require('./base');

var _base2 = _interopRequireDefault(_base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function StaleRequestError(message, debug, code, kinveyRequestId) {
  this.name = 'StaleRequestError';
  this.message = message || 'The time window for this request has expired.';
  this.debug = debug || undefined;
  this.code = code || undefined;
  this.kinveyRequestId = kinveyRequestId || undefined;
  this.stack = new Error().stack;
}
StaleRequestError.prototype = Object.create(_base2.default.prototype);
StaleRequestError.prototype.constructor = StaleRequestError;
exports.default = StaleRequestError;