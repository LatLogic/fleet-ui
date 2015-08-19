// Generated on 2015-02-18 using generator-angular 0.11.1
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {

    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);

    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);

    // Configurable paths for the application
    var appConfig = {
        src: require('./bower.json').appPath || 'src',
        dist: '.dist',
        bower: 'bower_components',
        temp: '.tmp'
    };

    // Define the configuration for all the tasks
    grunt.initConfig({

        // Project settings
        yeoman: appConfig,

        // Watches files for changes and runs tasks based on the changed files
        watch: {
            bower: {
                files: ['bower.json'],
                tasks: ['wiredep']
            },
            js: {
                files: ['<%= yeoman.src %>/app/**/*.js'],
                tasks: ['newer:jshint:all'],
                options: {
                    livereload: '<%= connect.options.livereload %>'
                }
            },
            jsTest: {
                files: ['test/spec/**/*.js'],
                tasks: ['newer:jshint:test', 'karma']
            },
            less: {
                files: [
                    '<%= yeoman.src %>/assets/less/*.less',
                    '<%= yeoman.src %>/app/**/*.less'
                ],
                tasks: ['less:server', 'postcss:server']
            },
            gruntfile: {
                files: ['Gruntfile.js']
            },
            livereload: {
                options: {
                    livereload: '<%= connect.options.livereload %>'
                },
                files: [
                    '<%= yeoman.src %>/**/*.html',
                    '<%= yeoman.temp %>/assets/css/{,*/}*.css',
                    '<%= yeoman.src %>/assets/data/{,*/}*',
                    '<%= yeoman.src %>/assets/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
                ]
            }
        },

        // The actual grunt server settings
        connect: {
            options: {
                port: 9000,
                // Change this to '0.0.0.0' to access the server from outside.
                hostname: '0.0.0.0',
                livereload: 35729
            },
            proxies: [{
                context: '/api',
                host: process.env.FLEET_HOST || 'localhost',
                port: process.env.FLEET_PORT || 80,
                https: false,
                xforward: false,
                headers: {
                    host: process.env.FLEET_HOST || 'localhost'
                }
            }],
            livereload: {
                options: {
                    debug: true,
                    open: false,
                    middleware: function (connect) {
                        return [
                            require('grunt-connect-proxy/lib/utils').proxyRequest,
                            connect.static('.tmp'),
                            connect().use(
                                '/bower_components',
                                connect.static('./bower_components')
                            ),
                            connect.static(appConfig.src)
                        ];
                    }
                }
            },
            test: {
                options: {
                    port: 9001,
                    middleware: function (connect) {
                        return [
                            connect.static('.tmp'),
                            connect.static('test'),
                            connect().use(
                                '/bower_components',
                                connect.static('./bower_components')
                            ),
                            connect.static(appConfig.src)
                        ];
                    }
                }
            },
            dist: {
                options: {
                    open: false,
                    base: '<%= yeoman.dist %>'
                }
            }
        },

        // Make sure code styles are up to par and there are no obvious mistakes
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish'),
                force: true
            },
            all: {
                src: [
                    'Gruntfile.js',
                    '<%= yeoman.src %>/app/**/*.js'
                ]
            },
            test: {
                src: ['test/spec/**/*.js']
            }
        },

        // Empties folders to start fresh
        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '<%= yeoman.temp %>',
                        '<%= yeoman.dist %>/{,*/}*',
                        '!<%= yeoman.dist %>/.git{,*/}*'
                    ]
                }]
            },
            server: '<%= yeoman.temp %>'
        },

        // Add vendor prefixed styles
        postcss: {
          options: {
            processors: [
              require('autoprefixer-core')({
                browsers: ['last 2 versions']
              })
            ]
          },
            server: {
                options: {
                    map: true
                },
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.temp %>/assets/css/',
                    src: '{,*/}*.css',
                    dest: '<%= yeoman.temp %>/assets/css/'
                }]
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.temp %>/assets/css/',
                    src: '{,*/}*.css',
                    dest: '<%= yeoman.temp %>/assets/css/'
                }]
            }
        },

        // Automatically inject Bower components into the app
        wiredep: {
            app: {
                options: {
                    exclude: [
                        // Exclude the css in favor of less
                        'bower_components/bootstrap',
                        'bower_components/font-awesome'
                    ]
                },
                src: ['<%= yeoman.src %>/index.html'],
                ignorePath:  /\.\.\//
            },
            test: {
                devDependencies: true,
                src: '<%= karma.unit.configFile %>',
                ignorePath:  /\.\.\//,
                fileTypes:{
                    js: {
                        block: /(([\s\t]*)\/\/\s*bower:*(\S*))(\n|\r|.)*?(\/\/\s*endbower)/gi,
                        detect: {
                            js: /'(.*\.js)'/gi
                        },
                        replace: {
                            js: '\'{{filePath}}\','
                        }
                    }
                }
            }
        },

        // Compiles Less to CSS and generates necessary files if requested
        less: {
            options: {
                paths: [
                    '<%= yeoman.src %>/assets/less'
                ]
            },
            dist: {
                options: {
                    compress: true
                },
                files: {
                    '<%= yeoman.temp %>/assets/css/app.css': [
                        '<%= yeoman.src %>/assets/less/app.less',
                        '<%= yeoman.src %>/app/**/*.less'
                    ]
                }
            },
            server: {
                options: {
                    sourceMap: true,
                    sourceMapFileInline: true
                },
                files: {
                    '<%= yeoman.temp %>/assets/css/app.css': [
                        '<%= yeoman.src %>/assets/less/app.less',
                        '<%= yeoman.src %>/app/**/*.less'
                    ]
                }
            }
        },

        // Renames files for browser caching purposes
        filerev: {
            dist: {
                src: [
                    '<%= yeoman.dist %>/app/**/*.js',
                    '<%= yeoman.dist %>/assets/css/{,*/}*.css',
                    '<%= yeoman.dist %>/assets/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
                    '<%= yeoman.dist %>/assets/fonts/{,*/}*.*'
                ]
            }
        },

        // Reads HTML for usemin blocks to enable smart builds that automatically
        // concat, minify and revision files. Creates configurations in memory so
        // additional tasks can operate on them
        useminPrepare: {
            html: '<%= yeoman.src %>/index.html',
            options: {
                dest: '<%= yeoman.dist %>',
                flow: {
                    html: {
                        steps: {
                            js: ['concat', 'uglifyjs'],
                            css: ['cssmin']
                        },
                        post: {}
                    }
                }
            }
        },

        // Performs rewrites based on filerev and the useminPrepare configuration
        usemin: {
            html: ['<%= yeoman.dist %>/**/*.html'],
            css: ['<%= yeoman.dist %>/assets/css/{,*/}*.css'],
            js: ['<%= yeoman.dist %>/assets/scripts/{,*/}*.js'],
            options: {
                assetsDirs: [
                    '<%= yeoman.dist %>',
                    '<%= yeoman.dist %>/assets/css',
                    '<%= yeoman.dist %>/assets/images'
                ],
                patterns: {
                    js: [
                        [/(assets\/images\/.*?\.(?:gif|jpeg|jpg|png|svg|webp))/gm,
                            'Update the JS to reference our revved images']
                    ]
                }
            }
        },

        // Note: cssmin target is generated by useminPrepare, but we can still
        // configure options here though
        cssmin: {
            options: {
                rebase: false
            }
        },

        imagemin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.src %>/assets/images',
                    src: '{,*/}*.{png,jpg,jpeg,gif}',
                    dest: '<%= yeoman.dist %>/assets/images'
                }]
            }
        },

        svgmin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.src %>/assets/images',
                    src: '{,*/}*.svg',
                    dest: '<%= yeoman.dist %>/assets/images'
                }]
            }
        },

        minifyHtml: {
            dist: {
                options: {
                    cdata: true,
                    empty: true
                },
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.dist %>',
                    src: ['*.html', 'app/**/*.html'],
                    dest: '<%= yeoman.dist %>'
                }]
            }
        },

        // ng-annotate tries to make the code safe for minification automatically
        // by using the Angular long form for dependency injection.
        ngAnnotate: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.temp %>/concat/assets/scripts',
                    src: '*.js',
                    dest: '<%= yeoman.temp %>/concat/assets/scripts'
                }]
            }
        },

        // Replace Google CDN references
        cdnify: {
            dist: {
                html: ['<%= yeoman.dist %>/*.html']
            }
        },

        // Copies remaining files to places other tasks can use
        copy: {
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= yeoman.src %>',
                    dest: '<%= yeoman.dist %>',
                    src: [
                        '*.{ico,png,txt}',
                        '.htaccess',
                        '*.html',
                        'app/**/*.html',
                        'assets/data/{,*/}*',
                        'assets/images/{,*/}*.{webp}',
                        'assets/fonts/{,*/}*.*'
                    ]
                }, {
                    // Copy 3rd party assets maintaining their directory structure
                    expand : true,
                    dest : '<%= yeoman.dist %>',
                    src : [
                        '<%= yeoman.bower %>/font-awesome/fonts/*',
                        '<%= yeoman.bower %>/bootstrap/fonts/*'
                    ]
                }]
            }
        },

        'string-replace': {
            css: {
                options: {
                    replacements: [{
                        pattern: /url\(\/bower_components/g,
                        replacement: 'url(../../bower_components'
                    }]
                },
                files: {
                    '<%= yeoman.dist %>/assets/css/':
                        '<%= yeoman.dist %>/assets/css/{,*/}*.css'
                }
            }
        },
        compress: {
            tar: {
                options: {
                    archive: './fleet-ui.tar.gz',
                    mode: 'tgz'
                },

                files: [
                    { cwd: '<%= yeoman.dist %>/', src: ['**'], expand: true }
                ]
            }
        },

        // Run some tasks in parallel to speed up the build process
        concurrent: {
            server: [
                'less:server'
            ],
            test: [
                'less'
            ],
            dist: [
                'less:dist',
                'imagemin',
                'svgmin'
            ]
        },

        // Test settings
        karma: {
            unit: {
                configFile: 'test/karma.conf.js',
                singleRun: true
            }
        }
    });


    grunt.registerTask('serve', 'Compile then start a connect web server', function (target) {
        if (target === 'dist') {
            return grunt.task.run(['build', 'connect:dist:keepalive']);
        }

        grunt.task.run([
            'clean:server',
            'wiredep',
            'configureProxies:server',
            'concurrent:server',
            'postcss:server',
            'connect:livereload',
            'watch'
        ]);
    });

    grunt.registerTask('test', [
        'clean:server',
        'wiredep',
        'concurrent:test',
        'postcss:server',
        'connect:test',
        'karma'
    ]);

    grunt.registerTask('build', [
        'clean:dist',
        'wiredep',
        'useminPrepare',
        'concurrent:dist',
        'postcss:dist',
        'concat',
        'ngAnnotate',
        'copy:dist',
        'cdnify',
        'cssmin',
        'string-replace:css',
        'uglify',
        'filerev',
        'usemin',
        'minifyHtml',
        'compress:tar'
    ]);

    grunt.registerTask('default', [
        'newer:jshint',
        'test',
        'build'
    ]);
};
