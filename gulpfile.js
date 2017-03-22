const fs = require('fs');
const gulp = require('gulp');
const del = require('del');
const pump = require('pump');
const sourcemaps = require('gulp-sourcemaps');
const tslint = require('gulp-tslint');
const rollup = require('gulp-rollup');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const releasePackage = require('./tools/release-package');
const runSequence = require('run-sequence');
const Karma = require('karma').Server;

/**
 * Remove build directory.
 */
gulp.task('clean', (cb) => {
  return del(['dist', 'coverage', 'example/dist', '*.tgz', '*.tar.gz'], cb);
});

/**
 * Builds entire project.
 */
gulp.task('build', ['tslint', 'ngc', 'assets', 'karma', 'bundle', 'compress']);

/**
 * Lint all TypeScript files.
 */
gulp.task('tslint', () => {
  return gulp
    .src(['index.ts', 'test.ts', 'src/**/*.ts', 'example/**/*.ts'])
    .pipe(tslint({
      formatter: 'prose',
      configuration: 'tslint.json'
    }))
    .pipe(tslint.report({emitError: true}));
});

gulp.task('tslint:watch', () => {
  gulp.watch(['index.ts', 'test.ts', 'src/**/*.ts', 'example/**/*.ts'], ['tslint']);
});

/**
 * Run external Angular TypeScript compiler.
 */
gulp.task('ngc', (cb) => {
  const exec = require('child_process').exec;
  const path = require('path');

  exec(path.normalize('node_modules/.bin/ngc'), (err, stdout, stderr) => {
    process.stdout.write(stdout);
    process.stderr.write(stderr);
    cb(err);
  });
});


/**
 * Runs tsc in watch mode - this can be used only for tests and local demo app.
 */
gulp.task('ngc:watch', (cb) => {
  gulp.watch(['index.ts', 'src/**/*.ts'], ['ngc']);
});

/**
 * Rollup config, creates UMD.
 */
gulp.task('bundle', ['ngc'], (cb) => {
  pump([
    gulp.src(['dist/index.js', 'dist/src/**/*.js', '!**/*.spec.*']),
    sourcemaps.init({loadMaps: true}),
    rollup(require('./tools/rollup.config.js')), // Use external config via require
    concat('resource-router.umd.js'), // Since we have 1 entry file, this actually just renames the output
    sourcemaps.write(),
    gulp.dest('dist/bundles/')
  ], cb);
});

/**
 * Creates minified version of the UMD bundle.
 */
gulp.task('compress', ['bundle'], (cb) => {
  pump([
    gulp.src(['dist/bundles/*.js', '!**/*.min.js']),
    sourcemaps.init({loadMaps: true}),
    uglify({
      mangle: false
    }),
    rename({suffix: '.min'}),
    sourcemaps.write(),
    gulp.dest('dist/bundles/')
  ], cb);
});

/**
 * Copies modified package.json to the dist directory.
 */
gulp.task('release-package', (cb) => {
  releasePackage('package.json', 'dist/package.json', cb);
});

gulp.task('release-info', () => {
  return gulp
    .src(['*.md', 'LICENSE.*', '.npmignore'])
    .pipe(gulp.dest('dist/'));
});

gulp.task('assets', ['release-package', 'release-info']);

/**
 * Run all tests once.
 */
gulp.task('test', ['tslint', 'ngc', 'karma']);

/**
 * Runs karma start --single-run
 */
gulp.task('karma', ['ngc'], (cb) => {
  new Karma({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, cb).start();
});

/**
 * Runs karma and watches for changes
 */
gulp.task('karma:watch', (cb) => {
  const instance = new Karma({
    configFile: __dirname + '/karma.conf.js',
    singleRun: false
  }, cb).start();
});

gulp.task('test:watch', ['tslint:watch', 'ngc:watch', 'karma:watch']);
