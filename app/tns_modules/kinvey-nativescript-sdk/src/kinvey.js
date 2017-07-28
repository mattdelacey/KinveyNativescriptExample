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
var kinvey_1 = require("kinvey-js-sdk/dist/kinvey");
var client_1 = require("./client");
var Kinvey = (function (_super) {
    __extends(Kinvey, _super);
    function Kinvey() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Kinvey.init = function (options) {
        return client_1.Client.init(options);
    };
    return Kinvey;
}(kinvey_1.Kinvey));
exports.Kinvey = Kinvey;
