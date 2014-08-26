module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        buildTimestamp: (new Date()).toISOString().slice(0,10).replace(/-/g,"") + '.' + (new Date()).toISOString().slice(11,16).replace(/:/g,""),
       
        meta: {
            banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
                '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
                '<%= pkg.homepage ? "* " + pkg.homepage + "\n" : "" %>' +
                '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
                ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */'
        },

        ember_handlebars: {
            compile: {
                options: {
                    processName: function(filePath) {
                        return filePath.replace('web/templates/', '').split('.')[0];
                    }
                },
                files: [
                    {
                        expand: true,     // Enable dynamic expansion.
                        cwd: 'web/templates/',      // Src matches are relative to this path.
                        src: ['**/*.hbs'], // Actual pattern(s) to match.
                        dest: 'web/build/handlebars/',   // Destination path prefix.
                        ext: '.js'   // Dest filepaths will have this extension.
                    }
                ]
            }
        },

        concat: {
            library:{
                src:[
                    'web/libs/<%= grunt.config("lib_jquery") %>',
                    'web/libs/<%= grunt.config("lib_hbs") %>',
                    'web/libs/<%= grunt.config("lib_ember") %>' 
                    ],
                dest:'dist/web/scripts/libs.js'
            },
            application: {
                src: [
                    'web/build/handlebars/**/*.js',
                    'web/scripts/app/app.js',
                    'web/scripts/app/components/*.js',
                    'web/scripts/modules/**/*.js'
                ],
                dest:'dist/web/scripts/app.js'
            },
            cssOutput: {
                src: [
                    'web/build/css/*.css'
                ],
                dest: 'dist/web/stylesheets/styles.css'
            }
        },

        compass: {
            prod: {
                options: {
                    config: 'config.rb'
                }
            }
        },
      
        copy: {
            build: {
                files: [
                    {
                        expand: true,
                        cwd: '.',
                        src: [
                            'package.json',
                            'Procfile'
                        ],
                        dest: 'dist/'
                    },
                    {
                        expand: true,
                        cwd: 'server',
                        src: [
                            'server.js'
                        ],
                        dest: 'dist'
                    },
                    {
                        expand: true,
                        cwd: 'server/config',
                        src: ['**'],
                        dest: 'dist/config'
                    },
                    {
                        expand: true,
                        cwd: 'server/constants',
                        src: ['**'],
                        dest: 'dist/constants'
                    },
                    {
                        expand: true,
                        cwd: 'server/controllers',
                        src: ['**'],
                        dest: 'dist/controllers'
                    },
                    {
                        expand: true,
                        cwd: 'server/routes',
                        src: ['**'],
                        dest: 'dist/routes'
                    },
                    {
                        expand: true,
                        cwd: 'web',
                        src: ['**', '!libs/**', '!scripts/**', '!stylesheets/**', '!templates/**'],
                        dest: 'dist/web'
                    }
                ]
            }
        },
        clean: {
            removedist: ["dist/"],
            removescss: ["web/stylesheets/css", "dist/web/stylesheets/*.scss"],
            removehbs: ["web/templates/js", "dist/web/templates/html"],
            removebuildfiles: ['dist/*', '!dist/*.zip']
        },

        replace: {
            common: {
                options: {
                    variables: {
                        'buildTimestamp' : '<%= buildTimestamp %>'
                    },
                    prefix: '@@'
                },
                files : {
                    'dist/constants/index.js' : [ 'dist/constants/index.js' ]
                }
            },
            dev: {
                options: {
                    variables: {
                        'activeConfig': 'dev'
                    },
                    prefix: '@@'
                },
                files : {
                    'dist/config/index.js' : [ 'dist/config/index.js' ]
                }
            },
            prod: {
                options: {
                    variables: {
                        'activeConfig': 'prod'
                    },
                    prefix: '@@'
                },
                files : {
                    'dist/config/index.js' : [ 'dist/config/index.js' ]
                }
            }
        },

        jslint: { 
          server: {
            src: [ // some example files
              'server/server.js',
              'server/constants/index.js',
              'server/config/index.js',
              'server/controllers/**/*.js',
              'server/routes/**/*.js'
            ],
            exclude: [
            ],
            directives: { // example directives
              node: true,
              todo: true,
              white: true,  //do not care about whitespace
              sloppy: true, //do not require 'use strict'
              nomen: true //do not care about leading/trailing _
            },
            options: {
              junit: 'lint/server-junit.xml', 
              jslintXml: 'lint/server-jslint.xml',
              failOnError: false, 
              checkstyle: 'lint/server-checkstyle.xml' 
            }
          },
          // lint your project's client code
          client: {
            src: [
              'web/scripts/app/app.js',
              'web/scripts/app/**/*.js',
              'web/scripts/modules/**/*.js'
            ],
            directives: {
              browser: true,
              predef: [
                'jQuery',
                'Ember',
                'Em',
                'Handlebars',
                'App',
                'console'
              ],
              white: true,  //do not care about whitespace
              sloppy: true, //do not require 'use strict'
              nomen: true //do not care about leading/trailing _
            },
            options: {
              junit: 'lint/client-junit.xml',
              jslintXml: 'lint/client-jslint.xml',
              failOnError: false,
              checkstyle: 'lint/client-checkstyle.xml' 
            }
          }
        },

        uglify: {
            options: {
              mangle: {
                except: ['jQuery', 'Ember', 'Handlebars']
              },
              compress: {
                drop_console: true
              }
            },
            prod_web: {
              files: {
                'dist/web/scripts/app.js': ['dist/web/scripts/app.js']
              }
            }
        },

        shell: {
            runNodeServer: {
                command: 'node server.js',
                options: {                      // Options
                    stdout: true,
                    execOptions: {
                        'cwd': 'dist'
                    }
                },
            }
        },

        imagemin: {
            dist: {
                options: { optimizationLevel: 4 },
                files: [{
                    expand: true,
                    cwd: 'dist/web/images',
                    src: [
                        '*.{png,jpg}'
                    ],
                    dest: 'dist/web/images/'
                }]
            }
        },

        htmlmin: {
            dist: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: {
                    'dist/web/index.html': 'dist/web/index.html'
                }
            }
        },

        karma: {
            frontend_unit: {
              configFile: 'fe.karma.conf.js'
            }
        },

        zip: {
            'dist/<%= pkg.name %>.zip': ['dist/**']
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-replace');
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-ember-handlebars');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-jslint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-zip');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-karma');

    grunt.registerTask('set_conf', 'Set a config property.', function(name, val) {
        console.log('Setting ' + name + ' to ' + val);
        grunt.config.set(name, val);
    });

    grunt.registerTask('common', [
        'clean:removedist',
        'copy:build',
        'ember_handlebars',
        'concat',
        'compass',
        'concat:cssOutput',
        'replace:common',
        'jslint',
        // 'clean:removescss',
        // 'clean:removehbs'
    ]);

    grunt.registerTask('default', [
        'set_conf:lib_ember:ember-1.7.js',
        'set_conf:lib_jquery:jquery-2.1.1.js',
        'set_conf:lib_hbs:handlebars-v1.3.0.js',
        'common',
        'replace:dev',
        'shell:runNodeServer'
    ]);

    grunt.registerTask('prod', [
        'set_conf:lib_ember:ember-1.7.min.js',
        'set_conf:lib_jquery:jquery-2.1.1.min.js',
        'set_conf:lib_hbs:handlebars.runtime-v1.3.0.js',
        'common',
        'replace:prod',
        'uglify',
        'imagemin',
        'htmlmin',
        'karma'
    ]);

    grunt.registerTask('package', [
        'prod',
        'zip',
        'clean:removebuildfiles'
    ]);
};