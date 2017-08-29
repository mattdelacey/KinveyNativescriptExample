'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.randomString = randomString;

function uid() {
  var size = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 10;

  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < size; i += 1) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
}

function randomString(size) {
  var prefix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

  return '' + prefix + uid(size);
}