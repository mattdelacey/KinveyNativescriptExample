var BasePage = require("../../shared/BasePage");
var topmost = require("ui/frame").topmost;
var view = require("ui/core/view");
//var Observable = require("data/observable").Observable;
var observable = require("data/observable");
var observableArray = require("data/observable-array");
var Kinvey = require('kinvey-nativescript-sdk').Kinvey;







var AccountsPage = function() {};
AccountsPage.prototype = new BasePage();
AccountsPage.prototype.constructor = AccountsPage;
var array = new observableArray.ObservableArray();

// Place any code you want to run when the home page loads here.
AccountsPage.prototype.contentLoaded = function(args) {
    var page = args.object;
  	
    var viewModel = new observable.Observable();

  	var dataStore = Kinvey.DataStore.collection('accounts', Kinvey.DataStoreType.Network);
	var stream = dataStore.find();
	stream.subscribe(function onNext(entities) {
  		console.log(JSON.stringify(entities));
      var charCode = "\e971";
  		var page = args.object;	
      
      array.push( entities );

  		page.bindingContext = {myItems: array};

	}, function onError(error) {
  		console.log(error);
	}, function onComplete() {
  		console.log('account data fetch complete');
	});

  
};

AccountsPage.prototype.refreshMe = function(args) {
  console.log('refreshMe');

      var page = args.object;
    //var array = new observableArray.ObservableArray();
    var viewModel = new observable.Observable();

    var dataStore = Kinvey.DataStore.collection('accounts', Kinvey.DataStoreType.Network);
    var stream = dataStore.find();
    stream.subscribe(function onNext(entities) {
      console.log('HERE$$$');
      //console.log(JSON.stringify(entities));
      var charCode = "\e971";
      var page = args.object; 

      //array = [];
      
      array= entities;
      console.log(array.length);
      console.log(JSON.stringify(array));
      //page.refresh();

      page.bindingContext = {myItems: array};

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