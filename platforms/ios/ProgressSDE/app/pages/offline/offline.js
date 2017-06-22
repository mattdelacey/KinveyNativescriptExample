var BasePage = require("../../shared/BasePage");
var topmost = require("ui/frame").topmost;
var view = require("ui/core/view");
var observable = require("data/observable");
var observableArray = require("data/observable-array");
var Kinvey = require('kinvey-nativescript-sdk').Kinvey;
//var page;


var OfflinePage = function() {};
OfflinePage.prototype = new BasePage();
OfflinePage.prototype.constructor = OfflinePage;

// Place any code you want to run when the home page loads here.
OfflinePage.prototype.contentLoaded = function(args) {
    console.log('load offline content');

    var page = args.object;
    var array = new observableArray.ObservableArray();
    var viewModel = new observable.Observable();

    var dataStore = Kinvey.DataStore.collection('accounts', Kinvey.DataStoreType.Network);
    var stream = dataStore.find();
    stream.subscribe(function onNext(entities) {
        console.log(JSON.stringify(entities));
        var charCode = "\e971";
        var page = args.object;

        array.push(entities);

        page.bindingContext = { myItems: array };

    }, function onError(error) {
        console.log(error);
    }, function onComplete() {
        console.log('account data fetch complete');
    });


};

OfflinePage.prototype.syncMe = function(args) {
    console.log('sync me');
};

OfflinePage.prototype.addMe = function(args) {
    console.log('add offline items');

    var tasks = [];
    for (var i = 0; i < 5; i++) {
        const task = {
            "accountname": "Account #" + i,
            "accountcompany": "Company #" + i,
            "autogen": true,
            "Title": "Sync Data"
        }
        tasks.push(task);
    }
    console.log(tasks);
    console.log( JSON.stringify(tasks));
    var myjson = JSON.stringify(tasks);

    var dataStore = Kinvey.DataStore.collection('accounts', Kinvey.DataStoreType.Sync);

    dataStore.save(tasks[0]).then(function(result) {
        console.log(result);
        //render(result);
        //console.log(data);
        //$scope.accounts = $scope.accounts.concat(result);



    }).catch(function(error) {
        console.log(error);
    });


};

function onPageLoaded(args) {
    console.log('offline page loaded');

};

exports.autoCreate = function(n) {
    var tasks = [];
    for (var i = 0; i < n; i++) {
        const task = {
            "accountname": "Account #" + i,
            "accountcompany": "Company #" + i,
            "autogen": true,
            "Title": "Sync Data"
        }
        tasks.push(task);
    }
    console.log(tasks);
    saveToStore(tasks);
}

OfflinePage.prototype.saveToStore = function(data) {
    //save the task to the store
    dataStore.save(data).then(function(result) {
        console.log(result);
        //render(result);
        console.log(data);
        //$scope.accounts = $scope.accounts.concat(result);



    }).catch(function(error) {
        console.log(error);
    });
}

exports.navigateTo = function(args) {
    console.log('HERE');
};

module.exports = new OfflinePage();
exports.onPageLoad = onPageLoaded;