'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _base = require('./base');

var _base2 = _interopRequireDefault(_base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function KinveyError(message, debug, code, kinveyRequestId) {
  this.name = 'KinveyError';
  this.message = message || 'An error occurred.';
  this.debug = debug || undefined;
  this.code = code || undefined;
  this.kinveyRequestId = kinveyRequestId || undefined;
  this.stack = new Error().stack;
}
KinveyError.prototype = Object.create(_base2.default.prototype);
KinveyError.prototype.constructor = KinveyError;
exports.default = KinveyError;