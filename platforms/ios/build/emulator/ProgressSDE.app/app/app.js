var application = require("application");
var Kinvey = require('kinvey-nativescript-sdk').Kinvey;
// import { Kinvey } from 'kinvey-nativescript-sdk';

Kinvey.init({
	appKey: "kid_B1zDUUJMZ",
	appSecret: "5dc457685be644d5837aefc27d412f3f"
});

var pushPlugin = require("nativescript-push-notifications");
        var self = this;
        var iosSettings = {
            badge: true,
            sound: true,
            alert: true,
            interactiveSettings: {
                actions: [{
                    identifier: 'READ_IDENTIFIER',
                    title: 'Read',
                    activationMode: "foreground",
                    destructive: false,
                    authenticationRequired: true
                }, {
                    identifier: 'CANCEL_IDENTIFIER',
                    title: 'Cancel',
                    activationMode: "foreground",
                    destructive: true,
                    authenticationRequired: true
                }],
                categories: [{
                    identifier: 'READ_CATEGORY',
                    actionsForDefaultContext: ['READ_IDENTIFIER', 'CANCEL_IDENTIFIER'],
                    actionsForMinimalContext: ['READ_IDENTIFIER', 'CANCEL_IDENTIFIER']
                }]
            },
            notificationCallbackIOS: function (data) {
                self.set("message", "" + JSON.stringify(data));
            }
        };

        pushPlugin.register(iosSettings, function (data) {
            self.set("message", "" + JSON.stringify(data));

            // Register the interactive settings
                if(iosSettings.interactiveSettings) {
                    pushPlugin.registerUserNotificationSettings(function() {
                        alert('Successfully registered for interactive push.');
                    }, function(err) {
                        alert('Error registering for interactive push: ' + JSON.stringify(err));
                    });
                }
        }, function() { });

application.start({ moduleName: "pages/home/home" });
