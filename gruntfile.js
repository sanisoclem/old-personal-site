"use strict";

module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        watch: {
            files: ["**/*", "!**/node_modules/**", "!**bower_components/**"],
            tasks: ["watch-tasks"],
        },
        jshint: {
            files: [
                "**/*.js",
                "**/*.js"
            ],
            options: {
                ignores: [
                    "node_modules/**",
                    "bower_components/**",
                    "public/css/**",
                    "public/js/lib/**",
                    "*"
                ],
                jshintrc: true
            }
        },
        jasmine_node: {
            options: {
                forceExit: true,
                matchall: true,
                showColors: true,
                includeStackTrace: true
            },
            all: ["test/server"]
        },
        karma: {
            unit: {
                configFile: "test/client/karma.conf.js",
                background: true
            },
            singleRun: {
                configFile: "test/client/karma.conf.js",
                singleRun: true
            },
            continuous: {
                configFile: "test/client/karma.conf.js",
                singleRun: true,
                reporters: "dots",
                browsers: ["Chrome"]
            }
        },
        protractor: {
            options: {
                configFile: "test/client/protractor-conf.js",
                keepAlive: true
            },
            continuous: {
                options: {
                    configFile: "test/client/protractor-conf.js",
                    keepAlive: false
                }
            }
        }
    });

    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-jasmine-node");
    grunt.loadNpmTasks("grunt-karma");
    grunt.loadNpmTasks("grunt-protractor-runner");

    grunt.registerTask("test", ["jshint", "jasmine_node"]);//, "karma:singleRun", "protractor"]);
    grunt.registerTask("ci", ["jshint", "jasmine_node", "karma:continuous", "protractor:continuous"]);

    // running `grunt w` will startup karma and run the watch tasks
    grunt.registerTask("w", ["karma:unit:start", "watch"]);
    grunt.registerTask("watch-tasks", ["jshint", "jasmine_node", "karma:unit:run", "protractor"]);

    grunt.registerTask("build",'builds client side resources', function() {
        console.log('build success');
    })
};
