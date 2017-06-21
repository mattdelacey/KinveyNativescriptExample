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

var viewModel = new observableModule.Observable({
    myItems: new observableArrayModule.ObservableArray([
        { accountname: 'First' },
        { accountname: 'Second' },
        { accountname: 'Third' },
    ])
});

// Place any code you want to run when the home page loads here.
AccountsPage.prototype.contentLoaded = function(args) {
    var page = args.object;


    var viewModel = new observable.Observable();

    var dataStore = Kinvey.DataStore.collection('accounts', Kinvey.DataStoreType.Network);
    var stream = dataStore.find();
    stream.subscribe(function onNext(entities) {
        console.log(JSON.stringify(entities));
        //var charCode = "\e971";
        var page = args.object;

        array.push(entities);

        page.bindingContext = { myItems: array };

        


        /*setInterval(function() {
        viewModel.myItems.push({
            accountname: 'New item'
        });
    }, 1000);*/

        //page.refresh();
    }, function onError(error) {
        console.log(error);
    }, function onComplete() {
        console.log('account data fetch complete');
    });




};

AccountsPage.prototype.refreshMe = function(args) {
    console.log('refreshMe');

    var page = args.object;
   
    var viewModel = new observable.Observable();

    var dataStore = Kinvey.DataStore.collection('accounts', Kinvey.DataStoreType.Network);
    var stream = dataStore.find();
    stream.subscribe(function onNext(entities) {
        
        
        var page = args.object;
        var parent = page.parent;

        array = entities;
        console.log(array.length);
        
        var listview = Frame.topmost().getViewById('listview');
        console.dir(listview);
        if ( listview == null ) {
          console.log('null');
        } else {
          console.log('not null');
        }

        page.bindingContext = {myItems: array};
        listview.refresh();

    }, function onError(error) {
        console.log(error);
    }, function onComplete() {
        console.log('account data fetch complete');
    });
};

function onPageLoaded(args) {
    console.log('accounts page loaded');

};

exports.navigateTo = function(args) {
    console.log('HERE');
};

module.exports = new AccountsPage();
exports.onPageLoad = onPageLoaded;