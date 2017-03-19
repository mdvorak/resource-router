module.exports = function (config) {
  let browsers = ['PhantomJS'];
  if (!process.env.TRAVIS) {
    browsers.push('Chrome');
  }

  config.set({
    logLevel: config.LOG_INFO,
    frameworks: ['jasmine'],
    reporters: ['progress'],
    browsers: browsers,

    files: [
      {pattern: 'dist/test.js'},
      {pattern: 'dist/index.js'}
    ]
    // TODO use webpack for tests
  });
};
