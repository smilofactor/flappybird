//Setting library requirements
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

//Setting directories
var siteDir = './site/';
var buildDir = './build/';
var JS = 'js/';
var Lib = 'lib';
var Scss = 'scss/';
var Css = 'css/';
var Img = 'img/';
var bowerComponents = './bower_components';
var siteJS = siteDir + JS;
var buildJS = buildDir + JS;
var siteLib = siteDir + Lib;
var siteScss = siteDir + Scss;
var siteCss = siteDir + Css;
var buildCss = buildDir + Css;
var siteImg = siteDir + Img;
var buildImg = buildDir + Img;


gulp.task('bower', function() {
    return bower({ directory: bowerComponents})
    .pipe(gulp.dest(siteLib))
});

gulp.task('jshint', function() {
  return gulp.src(siteJS + '*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('html', function() {
  return gulp.src(siteDir + 'index.html')
    .pipe(minifyHTML())
    .pipe(gulp.dest(buildDir));
});

gulp.task('scripts', ['jshint'], function() {
  return browserify(siteJS + 'main.js')
    .bundle()
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(gulp.dest(buildJS));
});

gulp.task('sass', ['bower'], function() {
  return gulp.src(siteScss + '*.scss')
    .pipe(sass({
        includePaths: [
            siteLib
        ]
    }))
    .pipe(gulp.dest(siteCss));
});

gulp.task('styles', ['sass'], function() {
  return gulp.src(siteCss + '*.css')
    .pipe(concat('./styles.css'))
    .pipe(gulp.dest(buildCss));
});

gulp.task('images', function() {
  return gulp.src(siteImg + '*')
    .pipe(imagemin())
    .pipe(gulp.dest(buildImg));
});

gulp.task('watch', function() {
  gulp.watch(bowerComponents + '*', ['bower']);
  gulp.watch(siteJS + '*.js', ['jshint']);
  gulp.watch(siteScss + '*.scss', ['sass']);
  gulp.watch(siteDir + 'index.html', ['html']);
  gulp.watch(siteCss + '*.css', ['styles']);
});

gulp.task('default', ['bower', 'jshint', 'sass', 'html', 'styles', 'watch']);

gulp.task('build', ['bower', 'jshint', 'sass', 'html', 'scripts', 'styles', 'images']);

