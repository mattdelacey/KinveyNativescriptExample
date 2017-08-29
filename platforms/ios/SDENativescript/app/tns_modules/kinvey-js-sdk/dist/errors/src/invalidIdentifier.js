'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _base = require('./base');

var _base2 = _interopRequireDefault(_base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function InvalidIdentifierError(message, debug, code, kinveyRequestId) {
  this.name = 'InvalidIdentifierError';
  this.message = message || 'One of more identifier names in the request has an invalid format.';
  this.debug = debug || undefined;
  this.code = code || undefined;
  this.kinveyRequestId = kinveyRequestId || undefined;
  this.stack = new Error().stack;
}
InvalidIdentifierError.prototype = Object.create(_base2.default.prototype);
InvalidIdentifierError.prototype.constructor = InvalidIdentifierError;
exports.default = InvalidIdentifierError;