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
var secure_1 = require("./secure");
var storage = new secure_1.SecureStorage();
var ActiveUserStorage = (function () {
    function ActiveUserStorage() {
    }
    ActiveUserStorage.prototype.get = function (key) {
        if (typeof key !== 'string') {
            throw new export_1.KinveyError('The key argument must be a string.');
        }
        try {
            return JSON.parse(storage.get(key));
        }
        catch (e) {
            export_1.Log.debug('Unable to parse stored active user.', e);
            return null;
        }
    };
    ActiveUserStorage.prototype.set = function (key, value) {
        if (typeof key !== 'string') {
            throw new export_1.KinveyError('The key argument must be a string.');
        }
        if (value !== null && value !== undefined && typeof value === 'object') {
            value = JSON.stringify(value);
        }
        if (value !== null && value !== undefined && typeof value !== 'string') {
            value = String(value);
        }
        if (export_1.isDefined(value)) {
            storage.set(key, value);
        }
        else {
            this.remove(key);
        }
        return value;
    };
    ActiveUserStorage.prototype.remove = function (key) {
        if (typeof key !== 'string') {
            throw new export_1.KinveyError('The key argument must be a string.');
        }
        storage.remove(key);
        return null;
    };
    return ActiveUserStorage;
}());
var Client = (function (_super) {
    __extends(Client, _super);
    function Client() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Client.init = function (config) {
        var client = export_1.Client.init(config);
        client.activeUserStorage = new ActiveUserStorage();
        return client;
    };
    return Client;
}(export_1.Client));
exports.Client = Client;
