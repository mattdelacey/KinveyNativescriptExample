"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SecureStorage = (function () {
    function SecureStorage() {
        this.defaultService = 'kinvey_nativescript_sdk';
    }
    SecureStorage.prototype.get = function (key) {
        if (key === null || key === undefined) {
            throw new Error('A key must be provided.');
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
        if (key === null || key === undefined) {
            throw new Error('A key must be provided.');
        }
        if (value !== null && typeof value === 'object') {
            value = JSON.stringify(value);
        }
        if (value !== null && typeof value !== 'string') {
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
        if (key === null || key === undefined) {
            throw new Error('A key must be provided.');
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
