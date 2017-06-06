var BasePage = require("../../shared/BasePage");
var topmost = require("ui/frame").topmost;
var view = require("ui/core/view");
var Observable = require("data/observable").Observable;
var observableArray = require("data/observable-array");
//var page;


var MapPage = function() {};
MapPage.prototype = new BasePage();
MapPage.prototype.constructor = MapPage;

// Place any code you want to run when the home page loads here.
MapPage.prototype.contentLoaded = function(args) {
    console.log('map loaded');
};

function onPageLoaded(args) {
    console.log('map page loaded');
  
};

exports.navigateTo = function(args) {
    console.log('HERE');
};

module.exports = new MapPage();
exports.onPageLoad = onPageLoaded;