var BasePage = require("../../shared/BasePage");
var topmost = require("ui/frame").topmost;
var Kinvey = require('kinvey-nativescript-sdk').Kinvey;
var observableModule = require("data/observable");


var HomePage = function() {};
HomePage.prototype = new BasePage();
HomePage.prototype.constructor = HomePage;

var source = new observableModule.Observable();

// Place any code you want to run when the home page loads here.
HomePage.prototype.contentLoaded = function(args) {

	console.log('home loaded');


	//load demobrandingdata
	//
	var dataStore = Kinvey.DataStore.collection('DemoBrandingData', Kinvey.DataStoreType.Network);
	var stream = dataStore.find();
	stream.subscribe(function onNext(entities) {
  		console.log(JSON.stringify(entities));

  		var page = args.object;	

    	
  		page.bindingContext = {brand: entities[0]};
	}, function onError(error) {
  		console.log(error);
	}, function onComplete() {
  		console.log('demobranding data complete');
	});

}

HomePage.prototype.fun = function() {
  var page = topmost().currentPage;
  var logo = page.getViewById("logo");
  logo.animate({
    rotate: 3600,
    duration: 3000
  }).then(function() {
    logo.rotate = 0;
  });
}

module.exports = new HomePage();
