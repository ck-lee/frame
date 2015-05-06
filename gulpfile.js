var gulp = require('gulp');
var exec = require('child_process').exec;
var nodemon = require('gulp-nodemon');
var lab = require('gulp-lab');

// Restart the server for changes.
gulp.task('build', function () {

    nodemon({
        script: 'server.js',
        verbose: true,
        ext: 'html js',
        nodeArgs: ['--debug']
    });
});

gulp.task('test', function (cb) {

    return gulp.src('test')
        .pipe(lab(('-c -L')));
});

gulp.task('test-debug', function (cb) {

    return gulp.src('test')
        .pipe(lab(['-D']));
});

gulp.task('test-halfway', function (cb) {

    return gulp.src('./test-halfway/**/*.js')
        .pipe(lab(['-D']));
});

gulp.task('watch-test-halfway', function (){

    gulp.watch(['lib/**', 'test-halfway/**'], ['test-halfway']);
});

gulp.task('watch-test', function (){

    gulp.watch(['lib/**', 'test/**'], ['test-debug']);
});

//default
gulp.task('default', ['build']);
