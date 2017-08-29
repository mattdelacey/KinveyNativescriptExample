'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _base = require('./base');

var _base2 = _interopRequireDefault(_base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function APIVersionNotAvailableError(message, debug, code, kinveyRequestId) {
  this.name = 'APIVersionNotAvailableError';
  this.message = message || 'This API version is not available for your app.';
  this.debug = debug || undefined;
  this.code = code || undefined;
  this.kinveyRequestId = kinveyRequestId || undefined;
  this.stack = new Error().stack;
}
APIVersionNotAvailableError.prototype = Object.create(_base2.default.prototype);
APIVersionNotAvailableError.prototype.constructor = APIVersionNotAvailableError;
exports.default = APIVersionNotAvailableError;