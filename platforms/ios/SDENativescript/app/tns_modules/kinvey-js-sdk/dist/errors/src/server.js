'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _base = require('./base');

var _base2 = _interopRequireDefault(_base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ServerError(message, debug, code, kinveyRequestId) {
  this.name = 'ServerError';
  this.message = message || 'An error occurred on the server.';
  this.debug = debug || undefined;
  this.code = code || 500;
  this.kinveyRequestId = kinveyRequestId || undefined;
  this.stack = new Error().stack;
}
ServerError.prototype = Object.create(_base2.default.prototype);
ServerError.prototype.constructor = ServerError;
exports.default = ServerError;