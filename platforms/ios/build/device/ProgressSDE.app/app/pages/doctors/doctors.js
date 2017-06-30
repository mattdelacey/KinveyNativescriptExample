var BasePage = require("../../shared/BasePage");
var topmost = require("ui/frame").topmost;
var view = require("ui/core/view");
//var Observable = require("data/observable").Observable;
var observable = require("data/observable");
var observableArray = require("data/observable-array");
var Kinvey = require('kinvey-nativescript-sdk').Kinvey;

var observableModule = require("data/observable");
var observableArrayModule = require("data/observable-array");
var Frame = require("ui/frame");

var AccountsPage = function() {};
AccountsPage.prototype = new BasePage();
AccountsPage.prototype.constructor = AccountsPage;
var array = new observableArray.ObservableArray();
var observeMe;
var myItems;
var observable_array_1 = require("data/observable-array");
var observable_1 = require("data/observable");
var tmpobservable;

// Place any code you want to run when the home page loads here.
AccountsPage.prototype.contentLoaded = function(args) {
    var page = args.object;

    myItems = new observable_array_1.ObservableArray();

    var dataStore = Kinvey.DataStore.collection('accounts', Kinvey.DataStoreType.Network);
    var stream = dataStore.find();
    stream.subscribe(function onNext(entities) {
        while(myItems.length > 0) {
            myItems.pop();
        }

        for (i=0; i < entities.length; i++) {

            console.log(entities[i]);
            myItems.push(entities[i]);
        }
        
        tmpobservable = new observable_1.Observable();
        tmpobservable.set("myItems", myItems);
        page.bindingContext = tmpobservable;

    }, function onError(error) {
        console.log(error);
    }, function onComplete() {
        console.log('account data fetch complete');
    });
};

AccountsPage.prototype.refreshMe = function(args) {
    console.log('refreshMe');

    var dataStore = Kinvey.DataStore.collection('accounts', Kinvey.DataStoreType.Network);
    var stream = dataStore.find();
    stream.subscribe(function onNext(entities) {

        console.log(entities.length);

        while(myItems.length > 0) {
            myItems.pop();
        }

        for (i=0; i < entities.length; i++) {

            console.log(entities[i]);
            myItems.push(entities[i]);
        }

    }, function onError(error) {
        console.log(error);
    }, function onComplete() {
        
        console.log('account data fetch complete');
    });
};

function onPageLoad(args) {
    console.log('accounts page loaded');

};

module.exports = new AccountsPage();
exports.onPageLoad = onPageLoad;