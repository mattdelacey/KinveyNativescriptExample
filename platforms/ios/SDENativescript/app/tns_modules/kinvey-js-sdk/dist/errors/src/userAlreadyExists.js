'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _base = require('./base');

var _base2 = _interopRequireDefault(_base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function UserAlreadyExistsError(message, debug, code, kinveyRequestId) {
  this.name = 'UserAlreadyExistsError';
  this.message = message || 'This username is already taken. Please retry your request with a different username.';
  this.debug = debug || undefined;
  this.code = code || undefined;
  this.kinveyRequestId = kinveyRequestId || undefined;
  this.stack = new Error().stack;
}
UserAlreadyExistsError.prototype = Object.create(_base2.default.prototype);
UserAlreadyExistsError.prototype.constructor = UserAlreadyExistsError;
exports.default = UserAlreadyExistsError;