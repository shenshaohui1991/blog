"use strict";

const gulp = require('gulp');
const uglify = require('gulp-uglify');
const stylus = require('gulp-stylus');
const autoprefixer = require('gulp-autoprefixer');
const cleancss = require('gulp-clean-css');
const imagemin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant');
const jpegtran = require('imagemin-jpegtran');

gulp.task('js', () => {
    return gulp.src('./src/js/**/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('./dist/js/'));
});

gulp.task('css', () => {
    return gulp.src('./src/stylus/ui.styl')
        .pipe(stylus())
        .pipe(autoprefixer())
        .pipe(cleancss())
        .pipe(gulp.dest('./dist/css/'));
});

gulp.task('img', function () {
    return gulp.src(['./src/img/*.png', './src/img/*.jpg'])
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant(), jpegtran()]
        }))
        .pipe(gulp.dest('./dist/img/'));
});

gulp.task('build', ['css', 'js']);
gulp.task('buildAll', ['css', 'js', 'img']);