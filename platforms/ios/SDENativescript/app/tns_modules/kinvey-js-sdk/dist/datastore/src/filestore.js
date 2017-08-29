'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _es6Promise = require('es6-promise');

var _es6Promise2 = _interopRequireDefault(_es6Promise);

var _map = require('lodash/map');

var _map2 = _interopRequireDefault(_map);

var _assign = require('lodash/assign');

var _assign2 = _interopRequireDefault(_assign);

var _isFunction = require('lodash/isFunction');

var _isFunction2 = _interopRequireDefault(_isFunction);

var _isNumber = require('lodash/isNumber');

var _isNumber2 = _interopRequireDefault(_isNumber);

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

var _request = require('../../request');

var _errors = require('../../errors');

var _utils = require('../../utils');

var _query = require('../../query');

var _query2 = _interopRequireDefault(_query);

var _networkstore = require('./networkstore');

var _networkstore2 = _interopRequireDefault(_networkstore);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function getStartIndex(rangeHeader, max) {
  var start = rangeHeader ? parseInt(rangeHeader.split('-')[1], 10) + 1 : 0;
  return start >= max ? max - 1 : start;
}

var FileStore = function (_NetworkStore) {
  _inherits(FileStore, _NetworkStore);

  function FileStore() {
    _classCallCheck(this, FileStore);

    return _possibleConstructorReturn(this, (FileStore.__proto__ || Object.getPrototypeOf(FileStore)).apply(this, arguments));
  }

  _createClass(FileStore, [{
    key: 'find',
    value: function find(query) {
      var _this2 = this;

      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      options = (0, _assign2.default)({ tls: true }, options);
      var queryStringObject = { tls: options.tls === true };

      if ((0, _isNumber2.default)(options.ttl)) {
        queryStringObject.ttl_in_seconds = parseInt(options.ttl, 10);
      }

      var stream = _utils.KinveyObservable.create(function (observer) {
        if ((0, _utils.isDefined)(query) && !(query instanceof _query2.default)) {
          return observer.error(new _errors.KinveyError('Invalid query. It must be an instance of the Query class.'));
        }

        var request = new _request.KinveyRequest({
          method: _request.RequestMethod.GET,
          authType: _request.AuthType.Default,
          url: _url2.default.format({
            protocol: _this2.client.apiProtocol,
            host: _this2.client.apiHost,
            pathname: _this2.pathname,
            query: queryStringObject
          }),
          properties: options.properties,
          query: query,
          timeout: options.timeout,
          client: _this2.client
        });
        return request.execute().then(function (response) {
          return response.data;
        }).then(function (data) {
          return observer.next(data);
        }).then(function () {
          return observer.complete();
        }).catch(function (error) {
          return observer.error(error);
        });
      });
      return stream.toPromise().then(function (files) {
        if (options.download === true) {
          return _es6Promise2.default.all((0, _map2.default)(files, function (file) {
            return _this2.downloadByUrl(file._downloadURL, options);
          }));
        }

        return files;
      });
    }
  }, {
    key: 'findById',
    value: function findById(id, options) {
      return this.download(id, options);
    }
  }, {
    key: 'download',
    value: function download(name) {
      var _this3 = this;

      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      options = (0, _assign2.default)({ tls: true }, options);
      var queryStringObject = { tls: options.tls === true };

      if ((0, _isNumber2.default)(options.ttl)) {
        queryStringObject.ttl_in_seconds = parseInt(options.ttl, 10);
      }

      var stream = _utils.KinveyObservable.create(function (observer) {
        if ((0, _utils.isDefined)(name) === false) {
          observer.next(undefined);
          return observer.complete();
        }

        var request = new _request.KinveyRequest({
          method: _request.RequestMethod.GET,
          authType: _request.AuthType.Default,
          url: _url2.default.format({
            protocol: _this3.client.apiProtocol,
            host: _this3.client.apiHost,
            pathname: _this3.pathname + '/' + name,
            query: queryStringObject
          }),
          properties: options.properties,
          timeout: options.timeout,
          client: _this3.client
        });
        return request.execute().then(function (response) {
          return response.data;
        }).then(function (data) {
          return observer.next(data);
        }).then(function () {
          return observer.complete();
        }).catch(function (error) {
          return observer.error(error);
        });
      });
      return stream.toPromise().then(function (file) {
        if (options.stream === true) {
          return file;
        }

        options.mimeType = file.mimeType;
        return _this3.downloadByUrl(file._downloadURL, options);
      });
    }
  }, {
    key: 'downloadByUrl',
    value: function downloadByUrl(url) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      var request = new _request.NetworkRequest({
        method: _request.RequestMethod.GET,
        url: url,
        timeout: options.timeout
      });
      return request.execute().then(function (response) {
        return response.data;
      });
    }
  }, {
    key: 'stream',
    value: function stream(name) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      options.stream = true;
      return this.download(name, options);
    }
  }, {
    key: 'upload',
    value: function upload(file) {
      var _this4 = this;

      var metadata = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      metadata = this.transformMetadata(file, metadata);
      var kinveyFileData = null;

      return this.saveFileMetadata(options, metadata).then(function (response) {
        kinveyFileData = response.data;
        return _this4.makeStatusCheckRequest(response.data._uploadURL, response.data._requiredHeaders, metadata, options.timeout);
      }).then(function (response) {
        _utils.Log.debug('File upload status check response', response);

        if (!response.isSuccess()) {
          return _es6Promise2.default.reject(response.error);
        }

        if (response.statusCode === 200 || response.statusCode === 201) {
          return response;
        }

        if (response.statusCode !== 308) {
          var error = new _errors.KinveyError('Unexpected response for upload file status check request.', false, response.statusCode, response.headers.get('X-Kinvey-Request-ID'));
          return _es6Promise2.default.reject(error);
        }

        var uploadOptions = {
          start: getStartIndex(response.headers.get('range'), metadata.size),
          timeout: options.timeout,
          maxBackoff: options.maxBackoff,
          headers: kinveyFileData._requiredHeaders
        };
        return _this4.retriableUpload(kinveyFileData._uploadURL, file, metadata, uploadOptions);
      }).then(function () {
        delete kinveyFileData._expiresAt;
        delete kinveyFileData._requiredHeaders;
        delete kinveyFileData._uploadURL;
        kinveyFileData._data = file;
        return kinveyFileData;
      });
    }
  }, {
    key: 'transformMetadata',
    value: function transformMetadata(file, metadata) {
      var fileMetadata = (0, _assign2.default)({
        filename: file._filename || file.name,
        public: false,
        size: file.size || file.length,
        mimeType: file.mimeType || file.type || 'application/octet-stream'
      }, metadata);
      fileMetadata._filename = metadata.filename;
      delete fileMetadata.filename;
      fileMetadata._public = metadata.public;
      delete fileMetadata.public;
      return fileMetadata;
    }
  }, {
    key: 'saveFileMetadata',
    value: function saveFileMetadata(options, metadata) {
      var isUpdate = (0, _utils.isDefined)(metadata._id);
      var request = new _request.KinveyRequest({
        method: isUpdate ? _request.RequestMethod.PUT : _request.RequestMethod.POST,
        authType: _request.AuthType.Default,
        headers: {
          'X-Kinvey-Content-Type': metadata.mimeType
        },
        url: _url2.default.format({
          protocol: this.client.apiProtocol,
          host: this.client.apiHost,
          pathname: isUpdate ? this.pathname + '/' + metadata._id : this.pathname
        }),
        properties: options.properties,
        timeout: options.timeout,
        body: metadata,
        client: this.client
      });
      return request.execute();
    }
  }, {
    key: 'makeStatusCheckRequest',
    value: function makeStatusCheckRequest(uploadUrl, requiredHeaders, metadata, timeout) {
      var headers = new _request.Headers(requiredHeaders);
      headers.set('content-type', metadata.mimeType);
      headers.set('content-range', 'bytes */' + metadata.size);
      var request = new _request.NetworkRequest({
        method: _request.RequestMethod.PUT,
        url: uploadUrl,
        timeout: timeout,
        headers: headers
      });
      return request.execute();
    }
  }, {
    key: 'retriableUpload',
    value: function retriableUpload(uploadUrl, file, metadata, options) {
      var _this5 = this;

      options = (0, _assign2.default)({
        count: 0,
        start: 0,
        maxBackoff: 32 * 1000
      }, options);

      _utils.Log.debug('Start file upload');
      _utils.Log.debug('File upload headers', options.headers);
      _utils.Log.debug('File upload upload url', _url2.default);
      _utils.Log.debug('File upload file', file);
      _utils.Log.debug('File upload metadata', metadata);
      _utils.Log.debug('File upload options', options);

      return this.makeUploadRequest(uploadUrl, file, metadata, options).then(function (response) {
        _utils.Log.debug('File upload response', response);

        if (response.isClientError()) {
          return _es6Promise2.default.reject(response.error);
        }
        if (!response.isSuccess() && !response.isServerError() && response.statusCode !== 308) {
          var error = new _errors.KinveyError('Unexpected response for upload file request.', false, response.statusCode, response.headers.get('X-Kinvey-Request-ID'));
          return _es6Promise2.default.reject(error);
        }

        return response;
      }).then(function (response) {
        var backoff = 0;

        if (response.isServerError()) {
          _utils.Log.debug('File upload server error. Probably network congestion.', response.statusCode, response.data);
          backoff = Math.pow(2, options.count) + randomInt(1, 1001);

          if (backoff >= options.maxBackoff) {
            return _es6Promise2.default.reject(response.error);
          }

          _utils.Log.debug('File upload will try again in ' + backoff + ' seconds.');

          return new _es6Promise2.default(function (resolve) {
            setTimeout(function () {
              options.count += 1;
              resolve(true);
            }, backoff);
          });
        }

        if (response.statusCode === 308) {
          _utils.Log.debug('File upload was incomplete (statusCode 308). Trying to upload the remainder of file.');
          options.start = getStartIndex(response.headers.get('range'), metadata.size);
          return new _es6Promise2.default(function (resolve) {
            setTimeout(function () {
              options.count = 0;
              resolve(true);
            }, backoff);
          });
        }

        return new _es6Promise2.default(function (resolve) {
          setTimeout(function () {
            resolve(false);
          }, backoff);
        });
      }).then(function (shouldRetry) {
        if (shouldRetry) {
          return _this5.retriableUpload(uploadUrl, file, metadata, options);
        }

        return null;
      });
    }
  }, {
    key: 'makeUploadRequest',
    value: function makeUploadRequest(uploadUrl, file, metadata, options) {
      var headers = new _request.Headers(options.headers);
      headers.set('content-type', metadata.mimeType);
      headers.set('content-range', 'bytes ' + options.start + '-' + (metadata.size - 1) + '/' + metadata.size);
      var request = new _request.NetworkRequest({
        method: _request.RequestMethod.PUT,
        url: uploadUrl,
        headers: headers,
        body: (0, _isFunction2.default)(file.slice) ? file.slice(options.start) : file,
        timeout: options.timeout
      });
      return request.execute();
    }
  }, {
    key: 'create',
    value: function create(file, metadata, options) {
      return this.upload(file, metadata, options);
    }
  }, {
    key: 'update',
    value: function update(file, metadata, options) {
      return this.upload(file, metadata, options);
    }
  }, {
    key: 'remove',
    value: function remove() {
      throw new _errors.KinveyError('Please use removeById() to remove files one by one.');
    }
  }, {
    key: 'pathname',
    get: function get() {
      return '/blob/' + this.client.appKey;
    }
  }]);

  return FileStore;
}(_networkstore2.default);

exports.default = FileStore;