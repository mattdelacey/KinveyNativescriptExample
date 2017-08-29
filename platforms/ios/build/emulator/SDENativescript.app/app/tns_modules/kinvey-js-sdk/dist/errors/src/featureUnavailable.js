'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _base = require('./base');

var _base2 = _interopRequireDefault(_base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function FeatureUnavailableError(message, debug, code, kinveyRequestId) {
  this.name = 'FeatureUnavailableError';
  this.message = message || 'Requested functionality is unavailable in this API version.';
  this.debug = debug || undefined;
  this.code = code || undefined;
  this.kinveyRequestId = kinveyRequestId || undefined;
  this.stack = new Error().stack;
}
FeatureUnavailableError.prototype = Object.create(_base2.default.prototype);
FeatureUnavailableError.prototype.constructor = FeatureUnavailableError;
exports.default = FeatureUnavailableError;