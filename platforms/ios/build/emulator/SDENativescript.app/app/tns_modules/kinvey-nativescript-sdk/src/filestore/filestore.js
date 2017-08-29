"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var file_system_1 = require("tns-core-modules/file-system");
var export_1 = require("kinvey-js-sdk/dist/export");
var common_1 = require("./common");
var FileStore = (function (_super) {
    __extends(FileStore, _super);
    function FileStore() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    FileStore.prototype.makeUploadRequest = function (url, file, metadata, options) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var filePath = file instanceof file_system_1.File ? file.path : file;
            var nsFileUrl = NSURL.fileURLWithPath(filePath);
            var nsUrl = NSURL.URLWithString(url);
            var nsRequest = NSMutableURLRequest.requestWithURL(nsUrl);
            nsRequest.HTTPMethod = 'PUT';
            options.headers['content-type'] = metadata.mimeType;
            options.headers['content-range'] = "bytes " + options.start + "-" + (metadata.size - 1) + "/" + metadata.size;
            for (var header in options.headers) {
                nsRequest.setValueForHTTPHeaderField(options.headers[header], header);
            }
            var nsSessionConfig = NSURLSessionConfiguration.defaultSessionConfiguration;
            nsSessionConfig.timeoutIntervalForRequest = options.timeout / 1000;
            nsSessionConfig.timeoutIntervalForResource = options.timeout / 1000;
            var nsSession = NSURLSession.sessionWithConfiguration(nsSessionConfig);
            var uploadTask = nsSession.uploadTaskWithRequestFromFileCompletionHandler(nsRequest, nsFileUrl, function (data, response, error) {
                if (error) {
                    reject(new export_1.KinveyError(error.localizedDescription));
                }
                else {
                    resolve(_this.createKinveyResponse(data, response));
                }
            });
            uploadTask.resume();
        });
    };
    FileStore.prototype.createKinveyResponse = function (data, response) {
        var config = {
            statusCode: response.statusCode,
            headers: {},
            data: NSString.alloc().initWithDataEncoding(data, NSUTF8StringEncoding)
        };
        for (var headerField in response.allHeaderFields) {
            config.headers[headerField] = response.allHeaderFields[headerField];
        }
        return new export_1.KinveyResponse(config);
    };
    return FileStore;
}(common_1.CommonFileStore));
exports.FileStore = FileStore;
