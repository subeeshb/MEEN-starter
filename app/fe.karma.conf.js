// Karma configuration
// Generated on Wed Jan 29 2014 15:47:58 GMT+0800 (SGT)

module.exports = function(config) {
  config.set({

    // base path, that will be used to resolve files and exclude
    basePath: '',


    // frameworks to use
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
      'dist/web/scripts/libs.js',
      'web/scripts/app/app.js',
      'web/scripts/app/components/*.js',
      'web/scripts/modules/**/*.js',
      'web/build/handlebars/*.js',
      'web/build/handlebars/**/*.js',
      'web/tests/vendor/ember-jasmine.js',
      'web/tests/vendor/ember-jasmine-setup.js',
      'web/tests/specs/**/test-*.js'
    ],

    plugins: [
        'karma-jasmine',
        'karma-ember-preprocessor',
        'karma-phantomjs-launcher',
        'karma-chrome-launcher',
        'karma-htmlfile-reporter',
	      'karma-junit-reporter',
        'karma-coverage'
    ],

    // list of files to exclude
    exclude: [
      
    ],

    preprocessors: {
        'web/scripts/app/app.js': ['coverage'],
        'web/scripts/modules/**/*.js': ['coverage']
    },


    // test results reporter to use
    // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
    reporters: ['progress', 'html', 'coverage', 'junit'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,


    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera (has to be installed with `npm install karma-opera-launcher`)
    // - Safari (only Mac; has to be installed with `npm install karma-safari-launcher`)
    // - PhantomJS
    // - IE (only Windows; has to be installed with `npm install karma-ie-launcher`)
    browsers: ['PhantomJS'],


    // If browser does not capture in given timeout [ms], kill it
    captureTimeout: 60000,


    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: true,

    htmlReporter: {
      outputFile: 'qa/frontend/results.html'
    },

    coverageReporter: {
      reporters:[
      {type: 'html', dir:'qa/frontend/'},
      {type: 'cobertura', dir:'qa/frontend/', file:'coverage.xml'}
      ]
    },

    junitReporter: {
      outputFile: 'qa/frontend/results.xml'
    }

  });
};
