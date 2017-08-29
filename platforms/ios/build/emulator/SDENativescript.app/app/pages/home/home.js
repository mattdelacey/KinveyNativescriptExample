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

    var activeUser = Kinvey.User.getActiveUser();

    if (!activeUser) {
        topmost().navigate("pages/login/login");
    }

    console.log('home loaded');

    var dataStore = Kinvey.DataStore.collection('DemoBrandingData', Kinvey.DataStoreType.Network);

    // Pull branding data
    //
    var subscription = dataStore.find()
        .subscribe(function(entities) {
            console.log(entities);
            var page = args.object;
            page.bindingContext = { brand: entities[0] };
        }, function(error) {
            console.log(error);
        }, function() {
            console.log('finished pulling home data');
        });

    //

}

module.exports = new HomePage();