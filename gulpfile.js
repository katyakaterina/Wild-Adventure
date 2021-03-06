'use strict'

var gulp = require('gulp');
var sass = require ('gulp-sass');
var rename = require('gulp-rename');
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

// gulp.task('watch', ['browser-sync', 'html', 'img', 'style'], function () {
//     gulp.watch('src/style/**/*.scss', ['style']);
//       gulp.watch('./*.html', browserSync.reload);
//       gulp.watch('src/js/**/*.js', browserSync.reload);
//       gulp.watch('src/img/*.+(jpg|jpeg|png|gif)', browserSync.reload);
// });
   
// gulp.task('sass', function () {
//     return gulp.src(['src/style/main.scss'])
//     .pipe(sass({outputStyle: 'expanded'})
//     .on('error', sass.logError))
//     .pipe(autoprefixer({
//        browsers: ['last 2 versions'],
//        cascade: false
//      }))
//     .pipe(gulp.dest('dist/css'))
//     .pipe(cssnano())
//     .pipe(rename({suffix: 'main.css'})) 
// });

gulp.task('sass:watch', function () {
gulp.watch('./sass/**/*.scss', ['sass']);
});

gulp.task('style', function () {
    return gulp.src(['src/style/main.scss'])  //если сасс
    .pipe(sass({outputStyle: 'expanded'})
    .on('error', sass.logError)) //сасс
    .pipe(postcss([ autoprefixer('last 2 versions')])) //последних двух версий браузера
    .pipe(csso())
    .pipe(rename('main.css'))
    .pipe(gulp.dest('dist/css'));
});

gulp.task("html", function () {
    return gulp.src("*.html")
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
        baseDir:'./'
      }
    });

});

// gulp.task('css', function () {
//     return gulp.src('src/*.css')
//         .pipe(postcss([ autoprefixer('last 2 versions')]))
//         .pipe(gulp.dest('./dest'));
// });

gulp.task('scripts', function() {
    gulp.src('src/js/main.js')
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
    gulp.src('src/js/main.js')
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

gulp.task('build', ['clean', 'html', 'style', 'img']);
// , function() {
//     var buildStyle = gulp.src(['css/main.css'])
//     .pipe(gulp.dest('dist/css'))
//     // var buildJS = gulp.src('js/*.js')  // если есть js
//     // .pipe(gulp.dest('./js'));
//     var buildFonts = gulp.src('src/fonts/**/*')
//     .pipe(gulp.dest('dist/fonts'));
//     var buildHtml = gulp.src('./*.html')
//     .pipe(gulp.dest('dist/html'));
// }
gulp.task('watch', ['browser-sync', 'style', 'html', 'img'], function () {
    gulp.watch('src/style/**/*.scss', ['style']);
      gulp.watch('./*.html', browserSync.reload);
      gulp.watch('src/img/*.+(jpg|jpeg|png|gif)', browserSync.reload);
    });
gulp.task("default", ["watch", "style", "html", "img"]);

