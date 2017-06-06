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
var events_1 = require("events");
var platform_1 = require("platform");
var client_1 = require("kinvey-js-sdk/dist/client");
var errors_1 = require("kinvey-js-sdk/dist/errors");
var utils_1 = require("kinvey-js-sdk/dist/utils");
var entity_1 = require("kinvey-js-sdk/dist/entity");
var request_1 = require("kinvey-js-sdk/dist/request");
var PushPlugin = require('nativescript-push-notifications');
var Push = (function (_super) {
    __extends(Push, _super);
    function Push(client) {
        var _this = _super.call(this) || this;
        _this.client = client;
        return _this;
    }
    Object.defineProperty(Push.prototype, "client", {
        get: function () {
            if (utils_1.isDefined(this._client) === false) {
                return client_1.default.sharedInstance();
            }
            return this._client;
        },
        set: function (client) {
            if (utils_1.isDefined(client) && (client instanceof client_1.default) === false) {
                throw new Error('client must be an instance of Client.');
            }
            this._client = client;
        },
        enumerable: true,
        configurable: true
    });
    Push.prototype.isSupported = function () {
        return true;
    };
    Push.prototype.onNotification = function (listener) {
        return this.on('notification', listener);
    };
    Push.prototype.onceNotification = function (listener) {
        return this.once('notification', listener);
    };
    Push.prototype.register = function (options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        return new es6_promise_1.Promise(function (resolve, reject) {
            if (_this.isSupported() === false) {
                return reject(new errors_1.KinveyError('Kinvey currently only supports push notifications on iOS and Android platforms.'));
            }
            if (utils_1.isDefined(PushPlugin) === false) {
                return reject(new errors_1.KinveyError('NativeScript Push Plugin is not installed.', 'Please refer to http://devcenter.kinvey.com/nativescript/guides/push#ProjectSetUp for help with'
                    + ' setting up your project.'));
            }
            options.notificationCallbackIOS = function (data) {
                _this.emit('notification', data);
            };
            PushPlugin.register(options, function (token) {
                if (options.interactiveSettings) {
                    PushPlugin.registerUserNotificationSettings(function () {
                        resolve(token);
                    }, function (error) {
                        resolve(token);
                    });
                }
                else {
                    resolve(token);
                }
            }, reject);
        })
            .then(function (token) {
            var activeUser = entity_1.User.getActiveUser(_this.client);
            if (utils_1.isDefined(token) === false) {
                throw new errors_1.KinveyError('Unable to retrieve the device token to register this device for push notifications.');
            }
            if (utils_1.isDefined(activeUser) === false && utils_1.isDefined(options.userId) === false) {
                throw new errors_1.KinveyError('Unable to register this device for push notifications.', 'You must login a user or provide a userId to assign the device token.');
            }
            var request = new request_1.KinveyRequest({
                method: request_1.RequestMethod.POST,
                url: _this.client.apiHostname + "/push/" + _this.client.appKey + "/register-device",
                authType: activeUser ? request_1.AuthType.Session : request_1.AuthType.Master,
                data: {
                    platform: platform_1.device.os.toLowerCase(),
                    framework: 'nativescript',
                    deviceId: token,
                    userId: utils_1.isDefined(activeUser) ? undefined : options.userId
                },
                properties: options.properties,
                timeout: options.timeout,
                client: _this.client
            });
            return request.execute()
                .then(function () { return token; });
        })
            .then(function (token) {
            var activeUser = entity_1.User.getActiveUser(_this.client);
            var userId = options.userId;
            if (utils_1.isDefined(activeUser) && utils_1.isDefined(userId) === false) {
                userId = activeUser._id;
            }
            var request = new request_1.CacheRequest({
                method: request_1.RequestMethod.PUT,
                url: _this.client.apiHostname + "/appdata/" + _this.client.appKey + "/__device",
                data: {
                    userId: userId,
                    token: token
                },
                client: _this.client
            });
            return request.execute()
                .then(function () { return token; });
        });
    };
    Push.prototype.unregister = function (options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        return new es6_promise_1.Promise(function (resolve, reject) {
            var activeUser = entity_1.User.getActiveUser(_this.client);
            var userId = options.userId;
            if (_this.isSupported() === false) {
                return reject(new errors_1.KinveyError('Kinvey currently only supports push notifications on iOS and Android platforms.'));
            }
            if (utils_1.isDefined(PushPlugin) === false) {
                return reject(new errors_1.KinveyError('NativeScript Push Plugin is not installed.', 'Please refer to http://devcenter.kinvey.com/nativescript/guides/push#ProjectSetUp for help with'
                    + ' setting up your project.'));
            }
            if (utils_1.isDefined(activeUser) === false && utils_1.isDefined(userId) === false) {
                throw new errors_1.KinveyError('Unable to unregister this device for push notifications.', 'You must login a user or provide a userId.');
            }
            PushPlugin.unregister(resolve, reject, options);
        })
            .then(function () {
            var activeUser = entity_1.User.getActiveUser(_this.client);
            var userId = options.userId;
            if (utils_1.isDefined(activeUser) && utils_1.isDefined(userId) === false) {
                userId = activeUser._id;
            }
            var request = new request_1.CacheRequest({
                method: request_1.RequestMethod.GET,
                url: _this.client.apiHostname + "/appdata/" + _this.client.appKey + "/__device/" + userId,
                client: _this.client
            });
            return request.execute()
                .catch(function (error) {
                if (error instanceof errors_1.NotFoundError) {
                    return {};
                }
                throw error;
            })
                .then(function (response) { return response.data; });
        })
            .then(function (device) {
            var activeUser = entity_1.User.getActiveUser(_this.client);
            var token;
            if (utils_1.isDefined(device)) {
                token = device.token;
            }
            if (utils_1.isDefined(token) === false) {
                return null;
            }
            var request = new request_1.KinveyRequest({
                method: request_1.RequestMethod.POST,
                url: _this.client.apiHostname + "/push/" + _this.client.appKey + "/unregister-device",
                authType: utils_1.isDefined(activeUser) ? request_1.AuthType.Session : request_1.AuthType.Master,
                data: {
                    platform: platform_1.device.os.toLowerCase(),
                    framework: 'nativescript',
                    deviceId: token,
                    userId: utils_1.isDefined(activeUser) ? undefined : options.userId
                },
                properties: options.properties,
                timeout: options.timeout,
                client: _this.client
            });
            return request.execute()
                .then(function (response) { return response.data; });
        })
            .then(function () {
            var activeUser = entity_1.User.getActiveUser(_this.client);
            var userId = options.userId;
            if (utils_1.isDefined(activeUser) && utils_1.isDefined(userId) === false) {
                userId = activeUser._id;
            }
            var request = new request_1.CacheRequest({
                method: request_1.RequestMethod.DELETE,
                url: _this.client.apiHostname + "/appdata/" + _this.client.appKey + "/__device/" + userId,
                client: _this.client
            });
            return request.execute()
                .catch(function (error) {
                if (error instanceof errors_1.NotFoundError) {
                    return {};
                }
                throw error;
            })
                .then(function () { return null; });
        });
    };
    return Push;
}(events_1.EventEmitter));
exports.Push = Push;
