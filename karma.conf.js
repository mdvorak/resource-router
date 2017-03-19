const {AotPlugin} = require('@ngtools/webpack');

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
      'test.ts',
      'main.ts',
      'lib/**/*.spec.ts'
    ],
    preprocessors: {
      'test.ts': ['webpack'],
      'main.ts': ['webpack'],
      'src/**/*.spec.ts': ['webpack']
    },
    mime: {
      'text/x-typescript': ['ts', 'tsx']
    },
    webpack: {
      devtool: "source-map",
      module: {
        "rules": [
          {
            "enforce": "pre",
            "test": /\.js$/,
            "loader": "source-map-loader",
            "exclude": [
              /\/node_modules\//
            ]
          },
          {
            "test": /\.ts$/,
            "loader": "@ngtools/webpack"
          }
        ]
      }
    },
    resolve: {
      "extensions": [
        ".ts",
        ".js"
      ],
      "modules": [
        "./node_modules"
      ]
    },
    plugins: [
      new AotPlugin({
        "mainPath": "main.ts",
        "entryModule": "TestModule",
        "exclude": [],
        "tsConfigPath": "tsconfig.json",
        "skipCodeGeneration": true
      })
    ]
  })
};
