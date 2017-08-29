var BasePage = require("../../shared/BasePage");
var topmost = require("ui/frame").topmost;
var view = require("ui/core/view");
var Observable = require("data/observable").Observable;
var observableArray = require("data/observable-array");
//var page;


var TasksPage = function() {};
TasksPage.prototype = new BasePage();
TasksPage.prototype.constructor = TasksPage;

// Place any code you want to run when the home page loads here.
TasksPage.prototype.contentLoaded = function(args) {
    console.log('tasks loaded');
    

};

function onPageLoaded(args) {
    console.log('tasks page loaded');
  
};

exports.navigateTo = function(args) {
    console.log('HERE');
};

module.exports = new TasksPage();
exports.onPageLoad = onPageLoaded;