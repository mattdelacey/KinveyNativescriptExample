'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _base = require('./base');

var _base2 = _interopRequireDefault(_base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function PopupError(message, debug, code, kinveyRequestId) {
  this.name = 'PopupError';
  this.message = message || 'Unable to open a popup on this platform.';
  this.debug = debug || undefined;
  this.code = code || undefined;
  this.kinveyRequestId = kinveyRequestId || undefined;
  this.stack = new Error().stack;
}
PopupError.prototype = Object.create(_base2.default.prototype);
PopupError.prototype.constructor = PopupError;
exports.default = PopupError;