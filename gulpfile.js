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

gulp.task('karma', ['ngc'], (cb) => {
  new Karma({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, cb).start();
});

gulp.task('test:tsc:watch', ['ngc'], (cb) => {
  const exec = require('child_process').exec;
  const path = require('path');

  exec(path.normalize('node_modules/.bin/tsc -w'), (err, stdout, stderr) => {
    process.stdout.write(stdout);
    process.stderr.write(stderr);
    cb(err);
  });
});

gulp.task('test:karma:watch', ['ngc'], (cb) => {
  // Delay a little for compiler to finish (ugly)
  const instance = new Karma({
    configFile: __dirname + '/karma.conf.js',
    singleRun: false
  }, cb);

  setTimeout(() => instance.start(), 5000);
});

gulp.task('test:watch', (cb) => {
  runSequence('clean', ['test:tsc:watch', 'test:karma:watch'], cb);
});
