var BasePage = require("../../shared/BasePage");
var Kinvey = require('kinvey-nativescript-sdk').Kinvey;
var view = require("ui/core/view");
var topmost = require("ui/frame").topmost;

var LoginPage = function() {};
LoginPage.prototype = new BasePage();
LoginPage.prototype.constructor = LoginPage;

module.exports = new LoginPage();
var frameModule = require("ui/frame");

var Page;
var email;

exports.pageLoaded = function(args) {
    console.log('loaded');
    Page = args.object;
};

exports.navigateTo = function(args) {
    console.log('HERE');
};

exports.register = function() {
    console.log('register');
    email = page.getViewById("email");
    pw = page.getViewById("pw");
    console.log(email.text);

    Kinvey.User.login(email.text, pw.text)
        .then(function(user) {
            console.dump(user);
            console.log('logged in');
        })
        .catch(function(error) {
            console.log(error.message);
        });
};


LoginPage.prototype.signIn = function(args) {
    var sender = args.object;
    var parent = sender.parent;

    console.log('signIn');
    email = view.getViewById(parent, "email");
    pw = view.getViewById(parent, "pw");
    console.log(email.text);

    // Kinvey.User.login(email.text, pw.text)
    Kinvey.User.logout()
        .then(function() {
            //return Kinvey.User.loginWithMIC('http://localhost:8100');
            return Kinvey.User.login(email.text, pw.text);

        })
        .then(function(user) {
            console.log(user);
            topmost().navigate("pages/home/home");
            console.log('logged in');
        })
        .catch(function(error) {
            console.log(error.message);
        });
};

LoginPage.prototype.logout = function(args) {
    Kinvey.User.logout()
        .then(function() {
            console.log('logging out');

        })
        .then(function(user) {
            console.log(user);

            console.log('logged out');
        })
        .catch(function(error) {
            console.log(error.message);
        });
}

LoginPage.prototype.signInMIC = function(args) {
    var sender = args.object;
    var parent = sender.parent;

    console.log('signIn');
    email = view.getViewById(parent, "email");
    pw = view.getViewById(parent, "pw");
    console.log(email.text);


    Kinvey.User.logout()
        .then(function() {
            console.log('logging out MIC user');

        })
        .then(function(user) {
            Kinvey.User.loginWithMIC('http://localhost:8100',
                    Kinvey.AuthorizationGrant.AuthorizationLoginPage, { version: "v2" })
                .then(function(user) {
                    console.log(user);
                    topmost().navigate("pages/home/home");
                    console.log('logged in');
                })
                .catch(function(error) {
                    console.log(error.message);
                });
        })
        .catch(function(error) {
            console.log(error.message);
        });
    /*.then(function() {
            return Kinvey.User.loginWithMIC('http://localhost:8100',
                    Kinvey.AuthorizationGrant.AuthorizationCodeAPI, { version: "v2" })
                .then(function(user) {
                    console.log(user);
                    topmost().navigate("pages/home/home");
                    console.log('logged in');
                })
                .catch(function(error) {
                    console.log(error.message);
                });
        }*/
}

module.exports = new LoginPage();