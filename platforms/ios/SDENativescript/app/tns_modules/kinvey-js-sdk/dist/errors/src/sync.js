'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _base = require('./base');

var _base2 = _interopRequireDefault(_base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function SyncError(message, debug, code, kinveyRequestId) {
  this.name = 'SyncError';
  this.message = message || 'An error occurred during sync.';
  this.debug = debug || undefined;
  this.code = code || undefined;
  this.kinveyRequestId = kinveyRequestId || undefined;
  this.stack = new Error().stack;
}
SyncError.prototype = Object.create(_base2.default.prototype);
SyncError.prototype.constructor = SyncError;
exports.default = SyncError;