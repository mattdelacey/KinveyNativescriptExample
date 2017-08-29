'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _base = require('./base');

var _base2 = _interopRequireDefault(_base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ActiveUserError(message, debug, code, kinveyRequestId) {
  this.name = 'ActiveUserError';
  this.message = message || 'An active user already exists.';
  this.debug = debug || undefined;
  this.code = code || undefined;
  this.kinveyRequestId = kinveyRequestId || undefined;
  this.stack = new Error().stack;
}
ActiveUserError.prototype = Object.create(_base2.default.prototype);
ActiveUserError.prototype.constructor = ActiveUserError;
exports.default = ActiveUserError;