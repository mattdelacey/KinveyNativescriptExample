'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _base = require('./base');

var _base2 = _interopRequireDefault(_base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function DuplicateEndUsersError(message, debug, code, kinveyRequestId) {
  this.name = 'DuplicateEndUsersError';
  this.message = message || 'More than one user registered with this username for this application.';
  this.debug = debug || undefined;
  this.code = code || undefined;
  this.kinveyRequestId = kinveyRequestId || undefined;
  this.stack = new Error().stack;
}
DuplicateEndUsersError.prototype = Object.create(_base2.default.prototype);
DuplicateEndUsersError.prototype.constructor = DuplicateEndUsersError;
exports.default = DuplicateEndUsersError;