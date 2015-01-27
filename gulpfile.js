var gulp = require('gulp'),
  jshint = require('gulp-jshint'),
  uglify = require('gulp-uglify'),
  browserify = require('browserify'),
  streamify = require('gulp-streamify'),
  source = require('vinyl-source-stream'),
  paths = {
    scripts: ['./*.js'],
  },

  swallowError = function (err) {
    console.log(err.message);
    this.end();
  };

gulp.task('lint', function () {
  return gulp.src('*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('sandbox', function () {
  gulp.watch(paths.scripts, function () {
    var bundleStream = browserify('./deal.js').bundle().on('error', swallowError);
    bundleStream
      .pipe(source('deal.js'))
      .pipe(gulp.dest('./build/'));
    });
}).on('error', swallowError);

gulp.task('default', function () {
  var bundleStream = browserify('./deal.js').bundle();
  bundleStream
    .pipe(source('deal.js'))
    .pipe(streamify(uglify()))
    .pipe(gulp.dest('./build/'));
});