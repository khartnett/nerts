/*global require */

var
    gulp            = require('gulp'),
    spawn           = require('child_process').spawn,
    path            = require('path'),
    plumber         = require('gulp-plumber'),
    coffee          = require('gulp-coffee'),
    gutil           = require('gulp-util'),
    watch           = require('gulp-watch'),
    include         = require('gulp-include'),
    uglify          = require('gulp-uglify'),
    node;

gulp.task('server', function() {
    if (node) node.kill()
    node = spawn('node', ['server.js'], {stdio: 'inherit'})
    node.on('close', function (code) {
        if (code === 8) {
            gulp.log('Error detected, waiting for changes...');
        }
    });
})

gulp.task('compile-script', function () {
    gulp.src('./src/app.coffee') // path to your file
        .pipe(plumber())
        .pipe(include())
        .pipe(coffee({bare: true}).on('error', gutil.log))
        // .pipe(uglify())
        .pipe(gulp.dest('./public/js'))
    ;
});
gulp.task('watch', function () {
    gulp.watch('./src/*.coffee', ['compile-script']);
    gulp.watch('./server.js', ['server']);
});

gulp.task('default', ['server', 'compile-script', 'watch']);

process.on('exit', function() {
    if (node) node.kill()
})
