'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _base = require('./base');

var _base2 = _interopRequireDefault(_base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function CORSDisabledError(message, debug, code, kinveyRequestId) {
  this.name = 'CORSDisabledError';
  this.message = message || 'Cross Origin Support is disabled for this application.';
  this.debug = debug || undefined;
  this.code = code || undefined;
  this.kinveyRequestId = kinveyRequestId || undefined;
  this.stack = new Error().stack;
}
CORSDisabledError.prototype = Object.create(_base2.default.prototype);
CORSDisabledError.prototype.constructor = CORSDisabledError;
exports.default = CORSDisabledError;