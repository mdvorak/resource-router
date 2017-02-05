module.exports = function (config) {
    config.set({
        frameworks: ["jasmine", "karma-typescript"],

        files: [
            {pattern: "base.spec.ts"},
            {pattern: "src/**/*.spec.ts"}
        ],

        // TODO karma-typescript sucks
        preprocessors: {
            "base.spec.ts": ["karma-typescript"],
            "src/**/*.ts": ["karma-typescript"]
        },

        reporters: ["progress", "karma-typescript"],

        browsers: ["PhantomJS"],
        singleRun: true
    });
};
