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
    libFiles = './bower_components/*/*.min.js',
    testFiles = './spec/*.js',
  	srcFiles = './src/*.js',
  	outDir = '.',
    outName = 'http-api.min.js';

gulp.task('clean', function (cb) {
  del(outDir + '/' + outName, cb);
});

gulp.task('jshint', function () {
  return gulp.src(srcFiles)
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('karma', function () {
  return gulp.src([libFiles, srcFiles, testFiles])
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
  gulp.watch(srcFiles, ['build']);
});

gulp.task('build', ['clean'], function () {
  return gulp.src(srcFiles)
    .pipe(uglify())
    .pipe(concat(outName))
    .pipe(gulp.dest(outDir));
});

gulp.task('serve', function () {
  connect.server({
    port: 8000
  });
});

gulp.task('launch', function () {
  exec('open http://localhost:8000')
});;

gulp.task('test', ['jshint', 'karma']);
gulp.task('run', ['serve', 'default']);
gulp.task('default', ['build', 'watch']);
