'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _base = require('./base');

var _base2 = _interopRequireDefault(_base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function BLError(message, debug, code, kinveyRequestId) {
  this.name = 'BLError';
  this.message = message || 'The Business Logic script did not complete.';
  this.debug = debug || undefined;
  this.code = code || undefined;
  this.kinveyRequestId = kinveyRequestId || undefined;
  this.stack = new Error().stack;
}
BLError.prototype = Object.create(_base2.default.prototype);
BLError.prototype.constructor = BLError;
exports.default = BLError;