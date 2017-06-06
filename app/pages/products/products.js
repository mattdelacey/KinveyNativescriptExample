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
    console.log('products loaded');
    var page = args.object;
  	var array = new observableArray.ObservableArray();

  	var dataStore = Kinvey.DataStore.collection('products', Kinvey.DataStoreType.Network);
	var stream = dataStore.find();
	stream.subscribe(function onNext(entities) {
  		console.log(JSON.stringify(entities));

  		var page = args.object;	

  		array.push( entities );
  		page.bindingContext = {myItems: array};

	}, function onError(error) {
  		console.log(error);
	}, function onComplete() {
  		console.log('demobranding data complete');
	});
};

function onPageLoaded(args) {
    console.log('product page loaded');
};

exports.navigateTo = function(args) {
    console.log('HERE');
};

module.exports = new ProductsPage();
exports.onPageLoad = onPageLoaded;