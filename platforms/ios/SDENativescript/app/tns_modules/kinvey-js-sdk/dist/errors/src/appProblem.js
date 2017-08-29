'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _base = require('./base');

var _base2 = _interopRequireDefault(_base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function AppProblemError(message, debug, code, kinveyRequestId) {
  this.name = 'AppProblemError';
  this.message = message || 'There is a problem with this app backend that prevents execution of this operation. Please contact support@kinvey.com for assistance.';
  this.debug = debug || undefined;
  this.code = code || undefined;
  this.kinveyRequestId = kinveyRequestId || undefined;
  this.stack = new Error().stack;
}
AppProblemError.prototype = Object.create(_base2.default.prototype);
AppProblemError.prototype.constructor = AppProblemError;
exports.default = AppProblemError;