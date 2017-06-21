'use strict';

var _export = require('kinvey-js-sdk/dist/export');

var _kinveyHtml5Sdk = require('kinvey-html5-sdk');

var _kinveyHtml5Sdk2 = _interopRequireDefault(_kinveyHtml5Sdk);

var _middleware = require('./middleware');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Setup racks
_export.CacheRack.useCacheMiddleware(new _middleware.CacheMiddleware());

// Export
module.exports = _kinveyHtml5Sdk2.default;