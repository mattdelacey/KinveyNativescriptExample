'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _base = require('./base');

var _base2 = _interopRequireDefault(_base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function KinveyInternalErrorStop(message, debug, code, kinveyRequestId) {
  this.name = 'KinveyInternalErrorStop';
  this.message = message || 'The Kinvey server encountered an unexpected error. Please contact support@kinvey.com for assistance.';
  this.debug = debug || undefined;
  this.code = code || undefined;
  this.kinveyRequestId = kinveyRequestId || undefined;
  this.stack = new Error().stack;
}
KinveyInternalErrorStop.prototype = Object.create(_base2.default.prototype);
KinveyInternalErrorStop.prototype.constructor = KinveyInternalErrorStop;
exports.default = KinveyInternalErrorStop;