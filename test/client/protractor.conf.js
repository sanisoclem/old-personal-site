exports.config = {
    allScriptsTimeout: 11000,

    specs: [
        "e2e/*.js"
    ],

    capabilities: {
        "browserName": "chrome"
    },

    baseUrl: "http://localhost:3000/colors/",

    framework: "jasmine",

    jasmineNodeOpts: {
        defaultTimeoutInterval: 30000
    }
};
