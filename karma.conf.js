// Karma configuration for Unit testing

module.exports = function (config) {

  let browsers = ['PhantomJS'];
  if (!process.env.TRAVIS) {
    browsers.push('Chrome');
  }

  const configuration = {
    plugins: [
      require('karma-jasmine'),
      require('karma-phantomjs-launcher'),
      require('karma-chrome-launcher'),
      require('karma-webpack'),
      require('karma-sourcemap-loader'),
      require('karma-spec-reporter')
    ],

    frameworks: ['jasmine'],

    files: [
      {pattern: 'test.js', watched: false}
    ],

    preprocessors: {
      'test.js': ['webpack']
    },

    // webpack
    webpack: {
      devtool: 'inline-source-map',
      resolve: {
        extensions: ['.js', '.ts']
      },
      module: {
        rules: [
          {
            "enforce": "pre",
            "test": /\.js$/,
            "loader": "source-map-loader",
            "exclude": [
              /node_modules/
            ]
          },
          {
            test: /\.ts/,
            loaders: ['ts-loader'],
            "exclude": [
              /\.d\.ts$/,
              /node_modules/
            ]
          }
        ],
        exprContextCritical: false
      },
      performance: {hints: false}
    },

    webpackServer: {
      noInfo: true
    },

    reporters: ['progress'],
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: browsers
  };

  config.set(configuration);
};
