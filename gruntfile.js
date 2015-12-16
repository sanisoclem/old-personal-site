"use strict";

module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        bower: {
            install: {
                options: {
                    targetDir: './lib',
                    layout: 'byComponent',
                    install: false,
                    verbose: false,
                    cleanTargetDir: true,
                    cleanBowerDir: false,
                    bowerOptions: {}
                }
            }
        },
        watch: {
            files: ["**/*", "!**/node_modules/**","!**lib/**", "!**bower_components/**"],
            tasks: ["watch-tasks"],
        },
        less: {
            production: {
                options: {
                    //paths: ["less/imports"],
                    plugins: [
                        new (require('less-plugin-autoprefix'))({browsers: ["last 2 versions"]}),
                        new (require('less-plugin-clean-css'))({advanced:true})
                    ],
                    modifyVars: {
                        //imgPath: '"http://mycdn.com/path/to/images"'
                    }
                },
                files: {
                    "public/css/app.css": "resources/less/app.less"
                }
            }
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
                    "lib/**",
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
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-bower-task');

    grunt.registerTask("test", ["jshint", "jasmine_node"]);//, "karma:singleRun", "protractor"]);
    grunt.registerTask("ci", ["jshint", "jasmine_node", "karma:continuous", "protractor:continuous"]);

    grunt.registerTask("watch-tasks", ["less:production", "jshint", "jasmine_node"]);

    grunt.registerTask("build", ['bower:install','less:production'])
};
