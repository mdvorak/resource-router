module.exports = function (config) {
    config.set({
        logLevel: config.LOG_INFO,
        frameworks: ['jasmine', 'karma-typescript'],
        reporters: ['progress', 'karma-typescript'],
        browsers: ['PhantomJS', 'Chrome'],

        files: [
            {pattern: 'test.ts'},
            {pattern: 'src/**/*.ts'}
        ],

        preprocessors: {
            '**/*.ts': ['karma-typescript']
        },

        karmaTypescriptConfig: {
            compilerOptions: {
                "moduleResolution": "node",
                "sourceMap": true,
                "removeComments": false,
                "emitDecoratorMetadata": true,
                "experimentalDecorators": true,
            },
            include: [
                "test.ts",
                "src/**/*.ts"
            ]
        }
    });
};
