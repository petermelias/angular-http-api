'use strict';

var gulp = require('gulp'),
  	concat = require('gulp-concat'),
  	connect = require('gulp-connect'),
  	jshint = require('gulp-jshint'),
  	size = require('gulp-size'),
  	uglify = require('gulp-uglify'),
    coverage = require('gulp-coverage'),
    karma = require('gulp-karma'),
  	del = require('del'),
    exec = require('child_process').exec,
    deps = [
      'node_modules/angular/lib/angular.min.js',
      'node_modules/underscore/underscore-min.js'
    ],
    testDeps = [
      'node_modules/angular-mocks/angular-mocks.js'
    ],
    testFilePattern = './spec/*.js',
  	srcFilePattern = './src/*.js',
  	outDir = '.',
    outName = 'http-api.min.js',
    bundleName = 'http-api-bundled.min.js';

gulp.task('clean', function (cb) {
  del(outDir + '/' + outName, cb);
});

gulp.task('clean-bundle', function (cb) {
  del(outDir + '/' + bundleName, cb);
});

gulp.task('jshint', function () {
  return gulp.src(srcFilePattern)
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('karma', function () {
  var fileList = [];
  fileList = fileList.concat(deps, testDeps, [srcFilePattern, testFilePattern]);
  return gulp.src(fileList)
    .pipe(karma({
      configFile: 'karma.conf.js',
      action: 'run'
    })).on('error', function (e) {
      throw e;
    });
});

gulp.task('size', ['build'], function () {
  return gulp.src(outDir + '/' + outName)
    .pipe(size({gzip: true}));
});

gulp.task('watch', function () {
  gulp.watch(srcFilePattern, ['build']);
});

gulp.task('build', ['clean'], function () {
  return gulp.src(srcFilePattern)
    .pipe(uglify())
    .pipe(concat(outName))
    .pipe(gulp.dest(outDir));
});

gulp.task('bundle', ['clean-bundle'], function () {
  return gulp.src(deps.concat(srcFilePattern))
    .pipe(uglify())
    .pipe(concat(bundleName))
    .pipe(gulp.dest(outDir));
});

gulp.task('serve', function () {
  connect.server({
    port: 8000,
    root: 'demo'
  });
});

gulp.task('test', ['jshint', 'karma']);
gulp.task('run', ['serve', 'default']);
gulp.task('default', ['build', 'watch']);
