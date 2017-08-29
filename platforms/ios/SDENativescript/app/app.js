var application = require("application");
var Kinvey = require('kinvey-nativescript-sdk').Kinvey;

Kinvey.init({
    appKey: 'kid_ZJk02vOUFg',
    appSecret: 'c1a32d5b3c474d0fa20a6f33fef396d5'
});

application.start({ moduleName: "pages/home/home" });