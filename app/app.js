var application = require("application");
var Kinvey = require('kinvey-nativescript-sdk').Kinvey;

Kinvey.init({
    appKey: '<appid>',
    appSecret: '<appsecret>'
});

application.start({ moduleName: "pages/home/home" });