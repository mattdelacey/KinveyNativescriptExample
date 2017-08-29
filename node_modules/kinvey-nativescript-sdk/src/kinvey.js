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
var es6_promise_1 = require("es6-promise");
var export_1 = require("kinvey-js-sdk/dist/export");
var client_1 = require("./client");
var USERS_NAMESPACE = 'user';
var ACTIVE_USER_COLLECTION_NAME = 'kinvey_active_user';
var Kinvey = (function (_super) {
    __extends(Kinvey, _super);
    function Kinvey() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Kinvey.initialize = function (config) {
        var client = Kinvey.init(config);
        return es6_promise_1.Promise.resolve(client.getActiveUser());
    };
    Kinvey.init = function (config) {
        if (config === void 0) { config = {}; }
        if (!export_1.isDefined(config.appKey)) {
            throw new export_1.KinveyError('No App Key was provided.'
                + ' Unable to create a new Client without an App Key.');
        }
        if (!export_1.isDefined(config.appSecret) && !export_1.isDefined(config.masterSecret)) {
            throw new export_1.KinveyError('No App Secret or Master Secret was provided.'
                + ' Unable to create a new Client without an App Secret.');
        }
        return client_1.Client.init(config);
    };
    return Kinvey;
}(export_1.Kinvey));
exports.Kinvey = Kinvey;
