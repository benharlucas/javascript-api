// Test configuration.
// To have console.log statements show up in the terminal, set captureConsole to true.
module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: "",


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ["jasmine", "sinon"],

    plugins: [
      'karma-chrome-launcher',
      'karma-jasmine',
      'karma-sinon'
    ],


    // list of files / patterns to load in the browser
    files: [
      "build-web/qminder-api.js",
      "test/web/*.test.js",
      "test/web/*.test.web.js"
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ["dots"],

    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_DEBUG,


    // enable / disable watching file and executing tests whenever any file changes
    // autoWatch: false,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ["ChromeNoSandboxHeadless"],

    customLaunchers: {
      ChromeNoSandboxHeadless: {
        base: "Chrome",
        flags: [
          "--no-sandbox",
          // See https://chromium.googlesource.com/chromium/src/+/lkgr/headless/README.md
          "--headless",
          "--disable-gpu",
          // Without a remote debugging port, Google Chrome exits immediately.
          " --remote-debugging-port=9222",
        ],
      },
    },

    client: {
      // NOTE: set it to true to see log statements from the browser.
      captureConsole: false,

      // This is needed to make sure setup & teardown sections run in sequence, for some reason.
      jasmine: {
        random: false
      }
    },


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: 1,

    browserNoActivityTimeout: 60000
  });
};
