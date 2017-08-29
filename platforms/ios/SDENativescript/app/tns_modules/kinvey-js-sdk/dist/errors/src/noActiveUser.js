'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _base = require('./base');

var _base2 = _interopRequireDefault(_base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function NoActiveUserError(message, debug, code, kinveyRequestId) {
  this.name = 'NoActiveUserError';
  this.message = message || 'There is not an active user.';
  this.debug = debug || undefined;
  this.code = code || undefined;
  this.kinveyRequestId = kinveyRequestId || undefined;
  this.stack = new Error().stack;
}
NoActiveUserError.prototype = Object.create(_base2.default.prototype);
NoActiveUserError.prototype.constructor = NoActiveUserError;
exports.default = NoActiveUserError;