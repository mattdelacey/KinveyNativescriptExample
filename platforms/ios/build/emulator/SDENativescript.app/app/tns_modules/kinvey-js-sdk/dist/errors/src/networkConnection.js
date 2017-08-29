'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _base = require('./base');

var _base2 = _interopRequireDefault(_base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function NetworkConnectionError(message, debug, code, kinveyRequestId) {
  this.name = 'NetworkConnectionError';
  this.message = message || 'There was an error connecting to the network.';
  this.debug = debug || undefined;
  this.code = code || undefined;
  this.kinveyRequestId = kinveyRequestId || undefined;
  this.stack = new Error().stack;
}
NetworkConnectionError.prototype = Object.create(_base2.default.prototype);
NetworkConnectionError.prototype.constructor = NetworkConnectionError;
exports.default = NetworkConnectionError;