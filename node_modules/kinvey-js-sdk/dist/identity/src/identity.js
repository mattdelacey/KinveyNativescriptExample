'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _client = require('../../client');

var _client2 = _interopRequireDefault(_client);

var _errors = require('../../errors');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Identity = function () {
  function Identity() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Identity);

    this.client = options.client || _client2.default.sharedInstance();
  }

  _createClass(Identity, [{
    key: 'isSupported',
    value: function isSupported() {
      return false;
    }
  }, {
    key: 'isOnline',
    value: function isOnline(session) {
      var currentTime = new Date().getTime() / 1000;
      return session && session.access_token && session.expires > currentTime;
    }
  }, {
    key: 'identity',
    get: function get() {
      throw new _errors.KinveyError('A subclass must override this property.');
    }
  }], [{
    key: 'isSupported',
    value: function isSupported() {
      return false;
    }
  }, {
    key: 'identity',
    get: function get() {
      throw new _errors.KinveyError('A subclass must override this property.');
    }
  }]);

  return Identity;
}();

exports.default = Identity;