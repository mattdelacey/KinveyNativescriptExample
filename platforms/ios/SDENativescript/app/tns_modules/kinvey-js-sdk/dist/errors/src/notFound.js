'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _base = require('./base');

var _base2 = _interopRequireDefault(_base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function NotFoundError(message, debug, code, kinveyRequestId) {
  this.name = 'NotFoundError';
  this.message = message || 'The entity was not found.';
  this.debug = debug || undefined;
  this.code = code || 404;
  this.kinveyRequestId = kinveyRequestId || undefined;
  this.stack = new Error().stack;
}
NotFoundError.prototype = Object.create(_base2.default.prototype);
NotFoundError.prototype.constructor = NotFoundError;
exports.default = NotFoundError;