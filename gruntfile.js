"use strict";

module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        clean: ["build", "static/lib","static/assets","typings","bower_components"],
            files: ['src/**/*.ts'],
            tasks: ['w']
        },
        tsd: {
            refresh: {
                options: {
                    command: 'reinstall',
                    latest: true,
                    config: 'tsd.json'
                }
            }
        },
        bower: {
            install: {
                options: {
                    targetDir: './static/lib',
                    layout: 'byComponent',
                    install: false,
                    verbose: false,
                    cleanTargetDir: true,
                    cleanBowerDir: false,
                    bowerOptions: {}
                }
            }
        },
        ts: {
            default: {
                files: [{ src: ['src/**/*.ts'], dest: 'build' }],
                options: {
                    fast: 'never',
                    module: 'commonjs',
                    target: 'es5'
                }
            }
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
                    "static/assets/css/app.css": "assets/less/app.less"
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-ts');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-bower-task');
    grunt.loadNpmTasks('grunt-tsd');
    grunt.loadNpmTasks('grunt-contrib-clean');
    

    //grunt.registerTask("test", ["jshint", "jasmine_node"]);

    grunt.registerTask("build", ['tsd','ts','bower:install','less:production']);
    
    grunt.registerTask("w", ['ts']);
};
