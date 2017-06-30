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
var client_1 = require("kinvey-js-sdk/dist/client");
var utils_1 = require("kinvey-js-sdk/dist/utils");
var secure_1 = require("./secure");
var Client = (function (_super) {
    __extends(Client, _super);
    function Client() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.storage = new secure_1.SecureStorage();
        return _this;
    }
    Client.prototype.getActiveUser = function () {
        var value = this.storage.get(this.appKey);
        try {
            return JSON.parse(value);
        }
        catch (e) {
            utils_1.Log.error(e);
            return null;
        }
    };
    Client.prototype.setActiveUser = function (activeUser) {
        if (utils_1.isDefined(activeUser)) {
            this.storage.set(this.appKey, JSON.stringify(activeUser));
        }
        else {
            this.storage.remove(this.appKey);
        }
        return activeUser;
    };
    return Client;
}(client_1.Client));
exports.Client = Client;
