var application = require("application");
var Kinvey = require('kinvey-nativescript-sdk').Kinvey;
// import { Kinvey } from 'kinvey-nativescript-sdk';

Kinvey.init({
	appKey: "kid_B1zDUUJMZ",
	appSecret: "5dc457685be644d5837aefc27d412f3f"
});

application.start({ moduleName: "pages/home/home" });
