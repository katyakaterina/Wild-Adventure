'use strict'

var gulp = require('gulp');
var sass = require ('gulp-sass');
var rename = require("gulp-rename");
var csso = require('gulp-csso');  // минификация css
var browserSync = require('browser-sync').create(); 
var postcss = require('gulp-postcss');  // плагин к автопрефиксеру, добавляет вендорные префиксы
var autoprefixer = require('autoprefixer');
var sourcemaps = require('gulp-sourcemaps');  //
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');  //min js
var pump = require('pump');
var imagemin = require('gulp-imagemin');
var posthtml = require('gulp-posthtml');
var clean = require('gulp-clean');



gulp.task('default', function() {
});

gulp.task('build', ['clean', 'html', 'mincss', 'img']), function() {
    var buildCss = gulp.src(['./style/style.css'])
    .pipe(gulp.dest('dist/css'));
    // var buildJS = gulp.src('js/*.js')
    // .pipe(gulp.dest('./js'));
    var buildFont = gulp.src('./fonts/*')
    .pipe(gulp.dest('dist/fonts'));
    var buildHtml = gulp.src('*.html')
    .pipe(gulp.dest('dist/html'));
}

gulp.task('watch', ['browser-sync', 'html', 'img', 'mincss', 'scripts'], function () {
    gulp.watch('src/style/**/*.css', ['css']);
      gulp.watch('./*.html', browserSync.reload);
      gulp.watch('src/js/**/*.js', browserSync.reload);
      gulp.watch('src/img/*.+(jpg|jpeg|png|gif)', browserSync.reload);
    });
   
    gulp.task('sass:watch', function () {
    gulp.watch('./sass/**/*.scss', ['sass']);
      });
gulp.task('mincss', function () {
    return gulp.src('src/style/style.css')  //если обычный 
    // return gulp.src('src/**/*.scss')  //если сасс
    // .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError)) //сасс
    .pipe(postcss([ autoprefixer('last 2 versions')]))  //последних двух версий браузера
        .pipe(csso())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('./dist'));
});

gulp.task("html", function () {
    return gulp.src("src/*.html")
      .pipe(gulp.dest("./*.html"))
  .pipe(gulp.dest('dist/html'));
});

gulp.task('browser-sync', function() {
    browserSync.init({
        open: true,
        server: {
            baseDir: "./"
        }
    });
    browserSync.watch('dist', browserSync.reload)
});
gulp.task('serve', function () {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
    gulp.watch("*.html").on("change", browserSync.reload);
    gulp.watch("*.css").on("change", browserSync.reload);
    gulp.watch("*.js").on("change", browserSync.reload);
});

gulp.task('css', function () {
    return gulp.src('.src/*.css')
        .pipe(postcss())
        .pipe(gulp.dest('./dest'));
});

gulp.task('scripts', function() {
    gulp.src('src/**/*.js')
      .pipe(sourcemaps.init())
    // return gulp.src(['src/js/javascript.js', 'src/js/test.js', 'src/js/picturefill.js'])
      .pipe(concat('./*.js')) 
      .pipe(rename("all.js"))
      .pipe(uglify())           
      .pipe(sourcemaps.write())
      .pipe(gulp.dest('dist'))
      .pipe(browserSync.reload({
          stream: true}))
});

gulp.task('js', function () {
    gulp.src('src/**/*.js')
      .pipe(minify())
      .pipe(gulp.dest("dist/js"));
    gulp.watch('js/*.js', ['uglify']);
});

gulp.task('compress', function (cb) {
    pump([
          gulp.src('src/**/*.js'),
          uglify(),
          gulp.dest('dist')
      ],
      cb
    );
  });

gulp.task('img', function () {
    return gulp.src('src/img/*')
      .pipe(imagemin({
  progressive: true,
        svgoPlugins: [{ removeViewBox: false }],
  
          interlaced: true
      }))
      .pipe(gulp.dest('dist/img'));
});

gulp.task('clean', function () {
    return gulp.src('dist', {read: false})
        .pipe(clean());
});

