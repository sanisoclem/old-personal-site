module.exports = function(config) {
    "use strict";

    config.set({

        basePath: ".",

        files: [
            // test files
            "unit/**/*.js"
        ],

        autoWatch: true,

        frameworks: ["jasmine"],

        browsers: ["Chrome"],

        plugins: [
            "karma-chrome-launcher",
            "karma-jasmine"
        ]
    });
};
