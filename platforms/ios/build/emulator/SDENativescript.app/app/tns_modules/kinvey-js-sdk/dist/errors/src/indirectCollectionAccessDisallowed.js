'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _base = require('./base');

var _base2 = _interopRequireDefault(_base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function IndirectCollectionAccessDisallowedError(message, debug, code, kinveyRequestId) {
  this.name = 'IndirectCollectionAccessDisallowedError';
  this.message = message || 'Please use the appropriate API to access this collection for this app backend.';
  this.debug = debug || undefined;
  this.code = code || undefined;
  this.kinveyRequestId = kinveyRequestId || undefined;
  this.stack = new Error().stack;
}
IndirectCollectionAccessDisallowedError.prototype = Object.create(_base2.default.prototype);
IndirectCollectionAccessDisallowedError.prototype.constructor = IndirectCollectionAccessDisallowedError;
exports.default = IndirectCollectionAccessDisallowedError;