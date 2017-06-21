'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _es6Promise = require('es6-promise');

var _es6Promise2 = _interopRequireDefault(_es6Promise);

var _export = require('kinvey-js-sdk/dist/export');

var _forEach = require('lodash/forEach');

var _forEach2 = _interopRequireDefault(_forEach);

var _isString = require('lodash/isString');

var _isString2 = _interopRequireDefault(_isString);

var _isArray = require('lodash/isArray');

var _isArray2 = _interopRequireDefault(_isArray);

var _isFunction = require('lodash/isFunction');

var _isFunction2 = _interopRequireDefault(_isFunction);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Sqlite = require('nativescript-sqlite');

// let dbCache = {};
// let isSupported;

// const TransactionMode = {
//   ReadWrite: 'readwrite',
//   ReadOnly: 'readonly',
// };
// Object.freeze(TransactionMode);

var SQLite = function () {
  function SQLite(name) {
    _classCallCheck(this, SQLite);

    // if (isDefined(name) === false) {
    //   throw new Error('A name is required to use the IndexedDB adapter.', name);
    // }

    // if (isString(name) === false) {
    //   throw new Error('The name must be a string to use the IndexedDB adapter', name);
    // }

    this.name = name;
    // this.inTransaction = false;
    // this.queue = [];
  }

  _createClass(SQLite, [{
    key: 'openTransaction',
    value: function openTransaction(collection) {
      var write = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var success = arguments[2];
      var error = arguments[3];
      var force = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;

      var db_promise = new Sqlite(this.name);
      db_promise.then(function (db) {
        // This should ALWAYS be true, db object is open in the "then" 
        console.log("Are we open yet (Inside Promise)? ", db.isOpen() ? "Yes" : "No"); // Yes 
        db.close();
      }, function (err) {
        console.error("We failed to open database", err);
      });
    }
  }, {
    key: 'close',
    value: function close() {}
  }, {
    key: 'find',
    value: function find(collection) {
      // return new Promise((resolve, reject) => {
      //   this.openTransaction(collection, false, (txn) => {
      //     const store = txn.objectStore(collection);
      //     const request = store.openCursor();
      //     const entities = [];

      //     request.onsuccess = (e) => {
      //       const cursor = e.target.result;

      //       if (cursor) {
      //         entities.push(cursor.value);
      //         return cursor.continue();
      //       }

      //       return resolve(entities);
      //     };

      //     request.onerror = (e) => {
      //       reject(e);
      //     };
      //   }, reject);
      // });
    }
  }, {
    key: 'findById',
    value: function findById(collection, id) {
      // return new Promise((resolve, reject) => {
      //   this.openTransaction(collection, false, (txn) => {
      //     const store = txn.objectStore(collection);
      //     const request = store.get(id);

      //     request.onsuccess = (e) => {
      //       const entity = e.target.result;

      //       if (entity) {
      //         resolve(entity);
      //       } else {
      //         reject(new NotFoundError(`An entity with _id = ${id} was not found in the ${collection}`
      //          + ` collection on the ${this.name} IndexedDB database.`));
      //       }
      //     };

      //     request.onerror = () => {
      //       reject(new NotFoundError(`An entity with _id = ${id} was not found in the ${collection}`
      //          + ` collection on the ${this.name} IndexedDB database.`));
      //     };
      //   }, reject);
      // });
    }
  }, {
    key: 'save',
    value: function save(collection, entities) {
      // let singular = false;

      // if (!isArray(entities)) {
      //   singular = true;
      //   entities = [entities];
      // }

      // if (entities.length === 0) {
      //   return Promise.resolve(null);
      // }

      // return new Promise((resolve, reject) => {
      //   this.openTransaction(collection, true, (txn) => {
      //     const store = txn.objectStore(collection);

      //     forEach(entities, (entity) => {
      //       store.put(entity);
      //     });

      //     txn.oncomplete = () => {
      //       resolve(singular ? entities[0] : entities);
      //     };

      //     txn.onerror = (e) => {
      //       reject(new Error(`An error occurred while saving the entities to the ${collection}`
      //         + ` collection on the ${this.name} IndexedDB database. ${e.target.error.message}.`));
      //     };
      //   }, reject);
      // });
    }
  }, {
    key: 'removeById',
    value: function removeById(collection, id) {
      // return new Promise((resolve, reject) => {
      //   this.openTransaction(collection, true, (txn) => {
      //     const store = txn.objectStore(collection);
      //     const request = store.get(id);
      //     store.delete(id);

      //     txn.oncomplete = () => {
      //       const entity = request.result;

      //       if (entity) {
      //         resolve(entity);
      //       } else {
      //         reject(new NotFoundError(`An entity with id = ${id} was not found in the ${collection}`
      //           + ` collection on the ${this.name} IndexedDB database.`));
      //       }
      //     };

      //     txn.onerror = () => {
      //       reject(new NotFoundError(`An entity with id = ${id} was not found in the ${collection}`
      //           + ` collection on the ${this.name} IndexedDB database.`));
      //     };
      //   }, reject);
      // });
    }
  }, {
    key: 'clear',
    value: function clear() {
      // Close the open DB to prevent from blocking the deleteDatabase operation
      // this.close();

      // // Delete the database
      // return new Promise((resolve, reject) => {
      //   const indexedDB = global.indexedDB || global.webkitIndexedDB || global.mozIndexedDB || global.msIndexedDB;
      //   const request = indexedDB.deleteDatabase(this.name);

      //   request.onsuccess = () => {
      //     dbCache = {};
      //     resolve();
      //   };

      //   request.onerror = (e) => {
      //     reject(new Error(`An error occurred while clearing the ${this.name} IndexedDB database.`
      //         + ` ${e.target.error.message}.`));
      //   };

      //   request.onblocked = () => {
      //     reject(new Error(`The ${this.name} IndexedDB database could not be cleared`
      //       + ' due to the operation being blocked.'));
      //   };
      // });
    }
  }]);

  return SQLite;
}();

exports.default = {
  load: function load(name) {
    //    const indexedDB = global.indexedDB || global.webkitIndexedDB || global.mozIndexedDB || global.msIndexedDB;
    var db = new SQLite(name);

    return db;

    // if (isDefined(indexedDB) === false) {
    //   return Promise.resolve(undefined);
    // }

    // if (isDefined(isSupported)) {
    //   if (isSupported) {
    //     return Promise.resolve(db);
    //   }

    //   return Promise.resolve(undefined);
    // }

    // return db.save('__testSupport', { _id: '1' })
    //   .then(() => {
    //     isSupported = true;
    //     return db;
    //   })
    //   .catch(() => {
    //     isSupported = false;
    //     return undefined;
    //   });
  }
};