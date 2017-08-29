"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SecureStorage = (function () {
    function SecureStorage() {
        this.defaultService = 'kinvey_nativescript_sdk';
    }
    SecureStorage.prototype.get = function (key) {
        if (typeof key !== 'string') {
            throw new Error('The key argument must be a string.');
        }
        var query = SAMKeychainQuery.new();
        query.service = this.defaultService;
        query.account = key;
        try {
            query.fetch();
            return query.password;
        }
        catch (e) {
            return null;
        }
    };
    SecureStorage.prototype.set = function (key, value) {
        if (typeof key !== 'string') {
            throw new Error('The key argument must be a string.');
        }
        if (value !== null && value !== undefined && typeof value === 'object') {
            value = JSON.stringify(value);
        }
        if (value !== null && value !== undefined && typeof value !== 'string') {
            value = String(value);
        }
        var accessibility = kSecAttrAccessibleAlwaysThisDeviceOnly;
        SAMKeychain.setAccessibilityType(accessibility);
        var query = SAMKeychainQuery.new();
        query.service = this.defaultService;
        query.account = key;
        query.password = value;
        return query.save();
    };
    SecureStorage.prototype.remove = function (key) {
        if (typeof key !== 'string') {
            throw new Error('The key argument must be a string.');
        }
        var query = SAMKeychainQuery.new();
        query.service = this.defaultService;
        query.account = key;
        try {
            return query.deleteItem();
        }
        catch (e) {
            return false;
        }
    };
    return SecureStorage;
}());
exports.SecureStorage = SecureStorage;
