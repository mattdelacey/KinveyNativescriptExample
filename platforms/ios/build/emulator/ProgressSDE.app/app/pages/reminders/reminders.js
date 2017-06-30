var BasePage = require("../../shared/BasePage");
var topmost = require("ui/frame").topmost;
var view = require("ui/core/view");
var observable = require("data/observable");
var observableArray = require("data/observable-array");
var Kinvey = require('kinvey-nativescript-sdk').Kinvey;
var observable_array_1 = require("data/observable-array");
var observable_1 = require("data/observable");
var myItems;
var tmpobservable;


var OfflinePage = function() {};
OfflinePage.prototype = new BasePage();
OfflinePage.prototype.constructor = OfflinePage;

var synched = false;

// Place any code you want to run when the home page loads here.
OfflinePage.prototype.contentLoaded = function(args) {

    console.log('load offline content');
    myItems = new observable_array_1.ObservableArray();
    var page = args.object;
    var dataStore = Kinvey.DataStore.collection('reminders', Kinvey.DataStoreType.Network);
    var stream = dataStore.find();
    stream.subscribe(function onNext(entities) {
        console.log(JSON.stringify(entities));

        for (i=0; i < entities.length; i++) {

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

OfflinePage.prototype.syncMe = function(args) {
    console.log('sync me');

    var dataStore = Kinvey.DataStore.collection('reminders', Kinvey.DataStoreType.Sync);

    var promise = dataStore.sync();
    promise = promise.then(function onSuccess(result) {
        // result will contain the results of the push to the backend and a pull from the backend
        // result = {
        //   push: [], // pushed entities
        //   pull: [] // pulled entities
        // };
        //
        console.log(result.push.length);
        console.log(result.pull.length);
        var dialogs = require("ui/dialogs");
        dialogs.alert({
            title: "Sync",
            message: result.push.length + " reminders synched to the backend.",
            okButtonText: "ok"
        }).then(function() {
            console.log("Dialog closed!");
        });
    }).catch(function onError(error) {
        console.log(error);
    });
};

OfflinePage.prototype.addMe = function(args) {

    var dataStore = Kinvey.DataStore.collection('reminders', Kinvey.DataStoreType.Sync);

    console.log('add offline items');
    console.log( myItems.length);

    var tasks = [];
    for (var i = 0; i < 200; i++) {
        const task = {
            "icon": "res://exam",
            "remindname": "Reminder #" + i,
            "autogen": true,
            "notes": "Note #" + i
        }
        tasks.push(task);
    }

    console.log(tasks.length);

    for (i = 0; i < tasks.length; i++) {
        myItems.push(tasks[i]);
    }

    var dialogs = require("ui/dialogs");
        dialogs.alert({
            title: "Local Save",
            message: tasks.length + " reminders added to local storage.",
            okButtonText: "ok"
        }).then(function() {
            console.log("Dialog closed!");
        });


    for (var i = 0; i < tasks.length; i++) {
        console.log(JSON.stringify(tasks[i]));
        

        dataStore.save(tasks[i]).then(function(result) {
          console.log(result);  
          myItems.push(tasks[i]);
            
        }).catch(function(error) {
            console.log(error);
        });
    }


};

function onPageLoaded(args) {
    console.log('offline page loaded');

};

/*exports.autoCreate = function(n) {
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
    //
    console.log(data.length);
    for (var i = 0; i < data.length; i++) {
        dataStore.save(data[i]).then(function(result) {
            console.log(result);

            console.log(data);

        }).catch(function(error) {
            console.log(error);
        });
    }
}*/

module.exports = new OfflinePage();
exports.onPageLoad = onPageLoaded;