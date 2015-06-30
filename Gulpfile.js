var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var babel = require('gulp-babel');

gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
});

gulp.task('babel', function() {
    gulp.src('src/app.js')
        .pipe(babel())
        .pipe(gulp.dest('dist'));
});

gulp.task('watch', function() {
  gulp.watch('request.js', ['babel']);
});

gulp.task('default', ['browser-sync', 'babel', 'watch']);