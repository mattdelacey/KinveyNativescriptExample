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
var request_1 = require("kinvey-js-sdk/dist/request");
var http_1 = require("http");
var platform_1 = require("platform");
var pkg = require('../../package.json');
function deviceInformation() {
    var platform = platform_1.device.os;
    var version = platform_1.device.osVersion;
    var manufacturer = platform_1.device.manufacturer;
    var parts = ["js-" + pkg.name + "/" + pkg.version];
    return parts.concat([platform, version, manufacturer]).map(function (part) {
        if (part) {
            return part.toString().replace(/\s/g, '_').toLowerCase();
        }
        return 'unknown';
    }).join(' ');
}
var HttpMiddleware = (function (_super) {
    __extends(HttpMiddleware, _super);
    function HttpMiddleware(name) {
        if (name === void 0) { name = 'Http Middleware'; }
        return _super.call(this, name) || this;
    }
    HttpMiddleware.prototype.handle = function (request) {
        var url = request.url, method = request.method, headers = request.headers, body = request.body, timeout = request.timeout, followRedirect = request.followRedirect;
        headers['X-Kinvey-Device-Information'] = deviceInformation();
        return http_1.request({
            method: method,
            headers: headers,
            url: url,
            content: body,
            timeout: timeout,
            dontFollowRedirects: followRedirect
        })
            .then(function (response) {
            return {
                response: {
                    statusCode: response.statusCode,
                    headers: response.headers,
                    data: response.content.toString()
                }
            };
        });
    };
    HttpMiddleware.prototype.cancel = function () {
        return Promise.resolve();
    };
    return HttpMiddleware;
}(request_1.Middleware));
exports.HttpMiddleware = HttpMiddleware;
