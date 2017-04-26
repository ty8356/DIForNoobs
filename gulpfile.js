var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var del = require('del');
var runSequence = require('run-sequence');
var deploy = require('gulp-gh-pages');

gulp.task('sass', function() {
    return gulp.src("app/scss/**/*.scss")
        .pipe(sass())
        .pipe(gulp.dest("app/css"))
        .pipe(browserSync.reload({ stream: true }));
});

gulp.task('reveal', function() {
    gulp.src('node_modules/reveal.js/css/**/*')
        .pipe(gulp.dest('app/reveal/css'))
        .pipe(gulp.dest('dist/reveal/css'));
    gulp.src('node_modules/reveal.js/js/**/*')
        .pipe(gulp.dest('app/reveal/js'))  
        .pipe(gulp.dest('dist/reveal/js'));
    gulp.src('node_modules/reveal.js/lib/**/*')
        .pipe(gulp.dest('app/reveal/lib'))  
        .pipe(gulp.dest('dist/reveal/lib'));
    gulp.src('node_modules/reveal.js/plugin/**/*')
        .pipe(gulp.dest('app/reveal/plugin'))  
        .pipe(gulp.dest('dist/reveal/plugin'));
});

gulp.task('browserSync', function() {
    browserSync.init({
        server: {
            baseDir: "app"
        }
    });
});

gulp.task('clean:dist', function() {
    return del.sync(['dist/**', '!dist']);
});

gulp.task('copy', function() {
    return gulp.src('app/**/*')
        .pipe(gulp.dest('dist'));
});

gulp.task('deploy', function () {
  return gulp.src("./dist/**/*")
    .pipe(deploy());
});

gulp.task('publish', function() {
    runSequence(
        'clean:dist',
        'copy',
        'deploy');
});

gulp.task('build', function(callback) {
    runSequence(
        'clean:dist',
        'copy',
        'sass',
        'reveal',
        callback);
});

gulp.task('watch', ['browserSync', 'sass'], function() {
    gulp.watch('app/scss/**/*.scss', ['sass']);
    gulp.watch('app/ts/**/*.ts', ['typescript']);
    gulp.watch('app/*.html', browserSync.reload);
    gulp.watch('app/js/**/*.js', browserSync.reload);
});

gulp.task('default', ['build', 'watch']);