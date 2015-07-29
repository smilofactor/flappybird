var gulp = require('gulp');

var jshint = require('gulp-jshint');
var sass = require('gulp-sass');
var imagemin = require('gulp-imagemin');
var browserify = require('browserify');
var uglify = require('gulp-uglify');
var minifyHTML = require('gulp-minify-html');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var bower = require('gulp-bower');


gulp.task('bower', function() {
    return bower({ directory: './bower_components'})
    .pipe(gulp.dest('site/lib/'))
});

gulp.task('jshint', function() {
  return gulp.src('site/js/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('html', function() {
  return gulp.src('site/index.html')
    .pipe(minifyHTML())
    .pipe(gulp.dest('build/'));
});

gulp.task('scripts', function() {
  //return browserify('./site/js/main.js')
  return browserify('site/js/main.js')
    .bundle()
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(gulp.dest('build/js/'));
});

gulp.task('styles', function() {
  return gulp.src('site/css/*.css')
    .pipe(concat('styles.css'))
    .pipe(gulp.dest('build/css/'));
});

gulp.task('sass', function() {
  return gulp.src('site/scss/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('site/css/'));
});

gulp.task('images', function() {
  return gulp.src('site/img/*')
    .pipe(imagemin())
    .pipe(gulp.dest('build/img/'));
});

gulp.task('watch', function() {
  gulp.watch('site/js/*.js', ['jshint']);
  gulp.watch('site/scss/*.scss', ['sass']);
});

gulp.task('default', ['jshint', 'sass', 'watch']);

gulp.task('build', ['jshint', 'sass', 'html', 'scripts', 'styles', 'images']);
//gulp.task('build', ['jshint', 'sass', 'html', 'scripts', 'bower', 'styles', 'images']);

