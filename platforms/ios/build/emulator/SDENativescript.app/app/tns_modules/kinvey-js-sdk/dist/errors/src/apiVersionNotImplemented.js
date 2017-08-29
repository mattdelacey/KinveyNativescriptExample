'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _base = require('./base');

var _base2 = _interopRequireDefault(_base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function APIVersionNotImplementedError(message, debug, code, kinveyRequestId) {
  this.name = 'APIVersionNotImplementedError';
  this.message = message || 'This API version is not implemented.';
  this.debug = debug || undefined;
  this.code = code || undefined;
  this.kinveyRequestId = kinveyRequestId || undefined;
  this.stack = new Error().stack;
}
APIVersionNotImplementedError.prototype = Object.create(_base2.default.prototype);
APIVersionNotImplementedError.prototype.constructor = APIVersionNotImplementedError;
exports.default = APIVersionNotImplementedError;