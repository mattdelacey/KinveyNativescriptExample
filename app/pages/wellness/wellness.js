var BasePage = require("../../shared/BasePage");
var topmost = require("ui/frame").topmost;
var view = require("ui/core/view");
var Observable = require("data/observable").Observable;
var observableArray = require("data/observable-array");
var Kinvey = require('kinvey-nativescript-sdk').Kinvey;


var ProductsPage = function() {};
ProductsPage.prototype = new BasePage();
ProductsPage.prototype.constructor = ProductsPage;

// Place any code you want to run when the home page loads here.
ProductsPage.prototype.contentLoaded = function(args) {
    console.log('wellness loaded');
    var page = args.object;
    var array = new observableArray.ObservableArray();

    var dataStore = Kinvey.DataStore.collection('wellness', Kinvey.DataStoreType.Network);

    // fetch wellness data
    //
    var subscription = dataStore.find()
        .subscribe(function(entities) {
            console.log(entities);
            var page = args.object;

            array.push(entities);
            page.bindingContext = {myItems: array};
        }, function(error) {
            console.log(error);
        }, function() {
            console.log('finished pulling wellness data');
        });

    //


};


function onPageLoaded(args) {
    console.log('wellness page loaded');
};

exports.navigateTo = function(args) {
    console.log('navigateTo');
};

module.exports = new ProductsPage();
exports.onPageLoad = onPageLoaded;