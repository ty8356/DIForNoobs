var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var del = require('del');
var runSequence = require('run-sequence');
var git = require('gulp-git');

gulp.task('sass', function() {
    return gulp.src("app/scss/**/*.scss")
        .pipe(sass())
        .pipe(gulp.dest("app/css"))
        .pipe(browserSync.reload({ stream: true }))
})

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
})

gulp.task('browserSync', function() {
    browserSync.init({
        server: {
            baseDir: "app"
        }
    });
})

gulp.task('add', function(){
  return gulp.src('./dist/*')
    .pipe(git.add());
})

gulp.task('commit', function(){
  return gulp.src('./dist/*')
    .pipe(git.commit('push to gh-pages'));
})

gulp.task('push', function(){
  git.push('https://github.com/ty8356/DIForNoobs.git', 'gh-pages', {args: " "}, function (err) {
    if (err) throw err;
  });
})

gulp.task('clean:dist', function() {
    return del.sync(['dist/**', '!dist']);
})

gulp.task('copy', function() {
    return gulp.src('app/**/*')
        .pipe(gulp.dest('dist'));
})

gulp.task('publish', function() {

})

gulp.task('build', function(callback) {
    runSequence(
        'clean:dist',
        'sass',
        'reveal',
        callback)
})

gulp.task('watch', ['browserSync', 'sass'], function() {
    gulp.watch('app/scss/**/*.scss', ['sass']);
    gulp.watch('app/ts/**/*.ts', ['typescript']);
    gulp.watch('app/*.html', browserSync.reload);
    gulp.watch('app/js/**/*.js', browserSync.reload);
})

gulp.task('deploy', function(callback) {
    runSequence(
        'clean:dist',
        'copy',
        'add',
        'commit',
        'push',
        callback);
})

gulp.task('default', ['build', 'watch'])