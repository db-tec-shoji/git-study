var gulp = require('gulp');
var sass = require('gulp-sass');
var plumber = require('gulp-plumber');
var browserSync = require('browser-sync').create();

gulp.task('sass', function() {
  gulp.src(['assets/scss/**/*.scss', '!assets/scss/**/_*.scss'])
    .pipe(plumber({
      errorHandler: function(error) {
        console.log(error.message);
        this.emit('end');
      }
    }))
    .pipe(sass({
      includePaths: 'assets/scss',
      outputStyle: 'compressed'
    }))
    .pipe(gulp.dest('dest/css/'))
    .pipe(browserSync.stream());
});

gulp.task('html', function() {
  gulp.src(['assets/*.html'])
    .pipe(plumber())
    .pipe(gulp.dest('dest/'));
});

gulp.task('bs-reload', function() {
  browserSync.reload();
});

gulp.task('serve', ['sass', 'html'], function() {
  browserSync.init({
    server: './dest/',
    open: true
  });
  gulp.watch(['assets/scss/**/*.scss'], ['sass']);
  gulp.watch(['assets/*.html'], ['html']);
  gulp.watch(['dest/*.html'], ['bs-reload']);
});
