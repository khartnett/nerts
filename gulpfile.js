/*global require */

var
    gulp            = require('gulp'),
    path            = require('path'),
    plumber         = require('gulp-plumber'),
    coffee          = require('gulp-coffee'),
    gutil           = require('gulp-util'),
    watch           = require('gulp-watch'),
    include         = require('gulp-include'),
    uglify          = require('gulp-uglify')
;

gulp.task('compile-script', function () {
    gulp.src('./src/app.coffee') // path to your file
        .pipe(plumber())
        .pipe(include())
        .pipe(coffee({bare: true}).on('error', gutil.log))
        .pipe(uglify())
        .pipe(gulp.dest('./public/js'))
    ;
});
gulp.task('watch', function () {
    gulp.watch('./script/**/*.coffee', ['compile-script']);
});

gulp.task('default', ['compile-script', 'watch']);

