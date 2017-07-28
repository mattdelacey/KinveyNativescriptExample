var application = require("application");
var Kinvey = require('kinvey-nativescript-sdk').Kinvey;

Kinvey.init({
    appKey: 'kid_rkROvpEZZ',
    appSecret: '3e9371c28fec4e70a3daed628ba71722'
});

application.start({ moduleName: "pages/home/home" });
