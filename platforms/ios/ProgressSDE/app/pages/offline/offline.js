var BasePage = require("../../shared/BasePage");
var topmost = require("ui/frame").topmost;
var view = require("ui/core/view");
var Observable = require("data/observable").Observable;
var observableArray = require("data/observable-array");
//var page;


var OfflinePage = function() {};
OfflinePage.prototype = new BasePage();
OfflinePage.prototype.constructor = OfflinePage;

// Place any code you want to run when the home page loads here.
OfflinePage.prototype.contentLoaded = function(args) {
    console.log('offline loaded');
   

};

function onPageLoaded(args) {
    console.log('offline page loaded');
  
};

exports.navigateTo = function(args) {
    console.log('HERE');
};

module.exports = new OfflinePage();
exports.onPageLoad = onPageLoaded;