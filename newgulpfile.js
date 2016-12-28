var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var nodemon = require('gulp-nodemon');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var gutil = require('gulp-util');
var inject = require('gulp-inject');
var angularFilesort = require('gulp-angular-filesort');
var bowerFiles = require('main-bower-files');
// var uglify = require('gulp-uglify');

gulp.task('default', ['watch']);

// Static server
gulp.task('browser-sync', function() {
   browserSync.init({
      server: {
         baseDir: "./"
      }
   });
});

gulp.task('build-js', function() {
   return gulp.src('./javascripts/**/*.js')
      .pipe(sourcemaps.init())
      .pipe(concat('bundle.js'))
      //only uglify if gulp is ran with '--type production'
      .pipe(gutil.env.type === 'production' ? uglify() : gutil.noop())
      .pipe(sourcemaps.write())
      .pipe(gulp.dest('./dist/javascripts'));
});

gulp.task('build-css', function () {
   return gulp.src('./stylesheets/*.scss')
      .pipe(sourcemaps.init())
      .pipe(sass())
      .pipe(sourcemaps.write())
      .pipe(gulp.dest('./dist/stylesheets'))
      // .pipe(browserSync.stream());
      .pipe(browserSync.reload({stream: true}));
});

gulp.task('inject-index', function(){
   return gulp.src("./index.html")
      .pipe(inject(gulp.src(bowerFiles(), {read: false}), {name: 'bower', relative: true}))
      .pipe(inject(
         gulp.src(['./javascripts/**/*.js'], {read: false}), {relative: true}
         // gulp.src(['./javascripts/**/*.js']).pipe(angularFilesort()).pipe(angularFilesort()), {relative: true}
      ))
      .pipe(inject(
         gulp.src(['./stylesheets/**/*.css'], {read: false}), {relative: true}
      ))
      .pipe(gulp.dest('./dist'));
});

gulp.task('watch', ['browser-sync', 'build-js', 'build-css', 'inject-index'], function () {
   gulp.watch("./javascripts/**/*.js", ['build-js']);
   gulp.watch("./stylesheets/*.scss", ['build-css']);
   gulp.watch(['./javascripts/**/*.js', './stylesheets/**/*.css'], ['inject-index']);
   gulp.watch("./**/*.html").on('change', browserSync.reload);
   gulp.watch('./javascripts/**/*.js').on('change', browserSync.reload);
});
