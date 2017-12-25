var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var exec = require('child_process').exec;

gulp.task('ng', (cb) => {
    exec('ng build', { cwd: 'client' }, (err, stdout, stderr) => {
        console.log('done');
        cb(err);
    });
});

gulp.task('nodemon', () => {
    nodemon({
        script: 'index.js'
    })
});

gulp.task('default', gulp.series('ng', 'nodemon'));