"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var file_system_1 = require("tns-core-modules/file-system");
var export_1 = require("kinvey-js-sdk/dist/export");
var KinveyWorker = (function () {
    function KinveyWorker(callerDir, scriptPathRelativeToCallerDir, options) {
        if (options === void 0) { options = { timeout: 30 * 60 * 1000, closeAfterResponse: true }; }
        var opts = options;
        if (typeof scriptPathRelativeToCallerDir === 'string') {
            this._uploadScript = file_system_1.path.join(callerDir, scriptPathRelativeToCallerDir);
        }
        else {
            this._uploadScript = callerDir;
            opts = scriptPathRelativeToCallerDir || options;
        }
        this._workerTimeout = opts.timeout;
        this._closeAfterResponse = opts.closeAfterResponse;
    }
    KinveyWorker.prototype.postMessage = function (message) {
        var _this = this;
        this._initializeWorker();
        return new Promise(function (resolve, reject) {
            _this._resolveUploadPromise = resolve;
            _this._rejectUploadPromise = reject;
            _this._worker.postMessage(message);
        });
    };
    KinveyWorker.prototype.terminate = function () {
        this._worker.terminate();
    };
    KinveyWorker.prototype._initializeWorker = function () {
        var _this = this;
        this._worker = new Worker(this._uploadScript);
        this._worker.onmessage = this._onMessage.bind(this);
        this._worker.onerror = this._onError.bind(this);
        setTimeout(function () {
            _this.terminate();
            if (_this._rejectUploadPromise) {
                _this._rejectUploadPromise(new export_1.KinveyError('Worker forcefully terminated due to timeout'));
            }
        }, this._workerTimeout);
    };
    KinveyWorker.prototype._onMessage = function (message) {
        if (this._closeAfterResponse) {
            this.terminate();
        }
        this._resolveUploadPromise(message.data);
    };
    KinveyWorker.prototype._onError = function (err) {
        this._rejectUploadPromise(new export_1.KinveyError(err.message));
    };
    return KinveyWorker;
}());
exports.KinveyWorker = KinveyWorker;
