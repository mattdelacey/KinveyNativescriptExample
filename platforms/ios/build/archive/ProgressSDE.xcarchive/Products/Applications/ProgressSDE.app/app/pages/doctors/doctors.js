var BasePage = require("../../shared/BasePage");
var topmost = require("ui/frame").topmost;
var view = require("ui/core/view");
var observable = require("data/observable");
var Kinvey = require('kinvey-nativescript-sdk').Kinvey;
var Frame = require("ui/frame");
var AccountsPage = function() {};
AccountsPage.prototype = new BasePage();
AccountsPage.prototype.constructor = AccountsPage;
var myItems;
var observable_array_1 = require("data/observable-array");
var tmpobservable = new observable.Observable();;

// Place any code you want to run when the home page loads here.
AccountsPage.prototype.contentLoaded = function(args) {
    var page = args.object;

    myItems = new observable_array_1.ObservableArray();

    var dataStore = Kinvey.DataStore.collection('doctors', Kinvey.DataStoreType.Network);

    // load doctor data
    //
    var subscription = dataStore.find()
        .subscribe(function(entities) {
            console.log(entities);

            while(myItems.length > 0 ) {
                myItems.pop();
            }

            for ( i = 0; i < entities.length; i ++ ) {
                myItems.push(entities[i]);
            }

            tmpobservable.set("myItems", myItems );
            page.bindingContext = tmpobservable;
        }, function(error) {
            console.log(error);
        }, function() {
            console.log('finished pulling doctor data');
        });

    //
};

AccountsPage.prototype.refreshMe = function(args) {
    console.log('refreshMe');

    var dataStore = Kinvey.DataStore.collection('doctors', Kinvey.DataStoreType.Network);
    var stream = dataStore.find();
    stream.subscribe(function onNext(entities) {

        console.log(entities.length);

        while (myItems.length > 0) {
            myItems.pop();
        }

        for (i = 0; i < entities.length; i++) {

            console.log(entities[i]);
            myItems.push(entities[i]);
        }

    }, function onError(error) {
        console.log(error);
    }, function onComplete() {

        console.log('doctors data fetch complete');
    });
};

function onPageLoad(args) {
    console.log('doctors page loaded');

};

module.exports = new AccountsPage();
exports.onPageLoad = onPageLoad;