// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['detectBrowsers', 'jasmine', '@angular/cli'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-edge-launcher'),
      require('karma-firefox-launcher'),
      require('karma-ie-launcher'),
      require('karma-safari-launcher'),
      require('karma-chrome-launcher'),
      require('karma-opera-launcher'),
      require('karma-phantomjs-launcher'),
      require('karma-detect-browsers'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage-istanbul-reporter'),
      require('@angular/cli/plugins/karma')
    ],
    client: {
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    coverageIstanbulReporter: {
      reports: ['html', 'lcovonly'],
      fixWebpackSourcePaths: true
    },
    angularCli: {
      environment: 'dev'
    },
    reporters: ['progress', 'kjhtml'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    singleRun: false,
    detectBrowsers: {
      postDetection: function (browsers) {
        // When overriden, use command line
        if (config.browsers && config.browsers.length) {
          console.log('Using browsers from command-line argument', config.browsers);
          return config.browsers;
        }

        // Run in headless mode
        browsers = browsers.map(function (b) {
          if (b === 'Chrome' || b === 'Firefox') {
            return b + 'Headless';
          }
          return b;
        });

        // Log and return
        console.log('Using filtered detected browsers', browsers);
        return browsers;
      }
    }
  });
};
