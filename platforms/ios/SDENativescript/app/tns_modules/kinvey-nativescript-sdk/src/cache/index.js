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
var export_1 = require("kinvey-js-sdk/dist/export");
var request_1 = require("kinvey-js-sdk/dist/request");
var storage_1 = require("kinvey-js-sdk/dist/request/src/middleware/src/storage");
var sqlite_1 = require("./sqlite");
var Storage = (function (_super) {
    __extends(Storage, _super);
    function Storage(name) {
        return _super.call(this, name) || this;
    }
    Storage.prototype.loadAdapter = function () {
        var _this = this;
        return sqlite_1.SQLite.load(this.name)
            .then(function (adapter) {
            if (!export_1.isDefined(adapter)) {
                return _super.prototype.loadAdapter.call(_this);
            }
            return adapter;
        });
    };
    return Storage;
}(storage_1.Storage));
var CacheMiddleware = (function (_super) {
    __extends(CacheMiddleware, _super);
    function CacheMiddleware() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CacheMiddleware.prototype.loadStorage = function (name) {
        return new Storage(name);
    };
    return CacheMiddleware;
}(request_1.CacheMiddleware));
exports.CacheMiddleware = CacheMiddleware;
