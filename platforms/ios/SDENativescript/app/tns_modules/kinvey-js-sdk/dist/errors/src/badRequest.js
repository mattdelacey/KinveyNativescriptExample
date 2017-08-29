'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _base = require('./base');

var _base2 = _interopRequireDefault(_base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function BadRequestError(message, debug, code, kinveyRequestId) {
  this.name = 'BadRequestError';
  this.message = message || 'Unable to understand request.';
  this.debug = debug || undefined;
  this.code = code || undefined;
  this.kinveyRequestId = kinveyRequestId || undefined;
  this.stack = new Error().stack;
}
BadRequestError.prototype = Object.create(_base2.default.prototype);
BadRequestError.prototype.constructor = BadRequestError;
exports.default = BadRequestError;