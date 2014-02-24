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
                        var data = filePath.substring(filePath.lastIndexOf('/') + 1,filePath.length);
                        var arr=[];
                        arr = data.split(".");
                        fullName = (filePath.indexOf('/components/') > -1) ? 'components/'+arr[0] : arr[0];
                        return fullName;
                    }
                },
                files: [
                    {
                        expand: true,     // Enable dynamic expansion.
                        cwd: 'web/templates/html/',      // Src matches are relative to this path.
                        src: ['**/*.hbs'], // Actual pattern(s) to match.
                        dest: 'web/templates/js/',   // Destination path prefix.
                        ext: '.js'   // Dest filepaths will have this extension.
                    }
                ]
            }
        },

        concat: {
            library:{
                src:[
                    'web/scripts/lib/jquery.min.js',
                    'web/scripts/lib/handlebars-1.1.2.js',
                    'web/scripts/lib/ember-1.3.2.js'
                    ],
                dest:'dist/web/scripts/libs.js'
            },
            application: {
                src: [
                    'web/templates/js/**/*.js',
                    'web/scripts/app/app.js',
                    'web/scripts/app/components/*.js'
                ],
                dest:'dist/web/scripts/app.js'
            },
            cssOutput: {
                src: [
                    'web/stylesheets/css/*.css'
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
                            'server.js',
                            'package.json',
                            'Procfile'
                        ],
                        dest: 'dist/'
                    },
                    {
                        expand: true,
                        cwd: 'config',
                        src: ['**'],
                        dest: 'dist/config'
                    },
                    {
                        expand: true,
                        cwd: 'constants',
                        src: ['**'],
                        dest: 'dist/constants'
                    },
                    {
                        expand: true,
                        cwd: 'controllers',
                        src: ['**'],
                        dest: 'dist/controllers'
                    },
                    {
                        expand: true,
                        cwd: 'routes',
                        src: ['**'],
                        dest: 'dist/routes'
                    },
                    {
                        expand: true,
                        cwd: 'web',
                        src: ['**', '!scripts/**', '!stylesheets/**', '!templates/**'],
                        dest: 'dist/web'
                    }
                ]
            }
        },
        clean: {
            removedist: ["dist/"],
            removescss: ["web/stylesheets/css", "dist/web/stylesheets/*.scss"],
            removehbs: ["web/templates/js", "dist/web/templates/html"]
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
                        'activeConfig': 'beta'
                    },
                    prefix: '@@'
                },
                files : {
                    'dist/config/index.js' : [ 'dist/config/index.js' ]
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
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-replace');
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-ember-handlebars');
    grunt.loadNpmTasks('grunt-contrib-concat');

    grunt.registerTask('common', [
        'clean:removedist',
        'copy:build',
        'ember_handlebars',
        'concat',
        'compass',
        'concat:cssOutput',
        'replace:common',
        'clean:removescss',
        'clean:removehbs'
    ]);

    grunt.registerTask('default', [
        'common',
        'replace:dev',
        'shell:runNodeServer'
    ]);

    grunt.registerTask('prod', [
        'common',
        'replace:prod'
    ]);
};