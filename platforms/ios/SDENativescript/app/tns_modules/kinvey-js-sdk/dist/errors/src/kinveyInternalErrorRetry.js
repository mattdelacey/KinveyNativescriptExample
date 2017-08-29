'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _base = require('./base');

var _base2 = _interopRequireDefault(_base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function KinveyInternalErrorRetry(message, debug, code, kinveyRequestId) {
  this.name = 'KinveyInternalErrorRetry';
  this.message = message || 'The Kinvey server encountered an unexpected error. Please retry your request.';
  this.debug = debug || undefined;
  this.code = code || undefined;
  this.kinveyRequestId = kinveyRequestId || undefined;
  this.stack = new Error().stack;
}
KinveyInternalErrorRetry.prototype = Object.create(_base2.default.prototype);
KinveyInternalErrorRetry.prototype.constructor = KinveyInternalErrorRetry;
exports.default = KinveyInternalErrorRetry;