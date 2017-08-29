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
var datastore_1 = require("kinvey-js-sdk/dist/datastore");
var worker_1 = require("../worker");
var CommonFileStore = (function (_super) {
    __extends(CommonFileStore, _super);
    function CommonFileStore() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CommonFileStore.prototype.upload = function (filePath, metadata, options) {
        if (!this.doesFileExist(filePath)) {
            return Promise.reject(new export_1.KinveyError('File does not exist'));
        }
        return _super.prototype.upload.call(this, filePath, metadata, options);
    };
    CommonFileStore.prototype.doesFileExist = function (file) {
        var filePath = file instanceof file_system_1.File ? file.path : file;
        return file_system_1.File.exists(filePath);
    };
    return CommonFileStore;
}(datastore_1.FileStore));
exports.CommonFileStore = CommonFileStore;
var FileUploadWorker = (function (_super) {
    __extends(FileUploadWorker, _super);
    function FileUploadWorker() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    FileUploadWorker.prototype.upload = function (options) {
        return this.postMessage(options)
            .then(function (responseConfig) { return new export_1.KinveyResponse(responseConfig); });
    };
    return FileUploadWorker;
}(worker_1.KinveyWorker));
exports.FileUploadWorker = FileUploadWorker;
