var gulp         = require('gulp');
var sass         = require('gulp-sass')(require('sass'));
var concat       = require('gulp-concat');
var cleanCSS     = require('gulp-clean-css');
var minify       = require('gulp-minify');
var bs           = require('browser-sync').create();
var pug          = require('gulp-pug');

gulp.task('scss', function() {
    return gulp.src('./src/scss/**/*.scss')
           .pipe(sass().on('error', sass.logError))
           .pipe(gulp.dest('./src/css'));
});
gulp.task('concat:css', function() {
    var folders = [
        './src/css/helpers/**/*.css',
        './src/css/blocks/**/*.css',
        './src/css/*.css'
    ];
    return gulp.src(folders)
           .pipe(concat('style.css'))
           .pipe(gulp.dest('./src/'));
});
gulp.task('minify:css', function() {
    return gulp.src('./src/style.css')
           .pipe(cleanCSS())
           .pipe(gulp.dest('./dist/'))
});
gulp.task('css', gulp.series('scss', 'concat:css', 'minify:css'));
gulp.task('css:watch', function(done){
    gulp.watch('./src/scss/**/*.scss', gulp.series('scss'));
    gulp.watch('./src/css/**/*.css', gulp.series('concat:css'));
});

gulp.task('concat:js', function() {
    const files = [
        './src/js/classes/Field.js',
        './src/js/classes/Node.js',
        './src/js/classes/NodeList.js',
        './src/js/classes/SnakeNode.js',
        './src/js/classes/AppleNode.js',
        './src/js/classes/Snake.js',
        './src/js/app.js',
        './src/js/app.js',
        './src/js/app.js',
        './src/js/index.js',
        './src/js/new-ui.js',
    ];
    return gulp.src(files, { allowEmpty: true })
           .pipe(concat('script.js'))
           .pipe(gulp.dest('./src/'));
});
gulp.task('minify:js', function() {
    return gulp.src('./src/script.js')
           .pipe(minify())
           .pipe(gulp.dest('./dist/'))
});
gulp.task('js', gulp.series('concat:js', 'minify:js'));
gulp.task('js:watch', function(){
    return gulp.watch('./src/js/**/*.js', gulp.series('concat:js'));
});

gulp.task('pug', function(){
    return gulp.src('./src/pug/**/*.pug')
           .pipe(pug())
           .pipe(gulp.dest('./src/html'))
           .pipe(gulp.dest('./dist/html'))
});
gulp.task('pug:watch', function(){
    return gulp.watch('./src/pug/**/*.pug', gulp.series('pug'));
});

gulp.task('default', gulp.parallel('css', 'js', 'pug'));

gulp.task('serve', gulp.series('default', gulp.parallel('css:watch', 'js:watch', 'pug:watch', function(){
    bs.init({
        server: {
            baseDir: 'src',
            directory: true
        },
    });
    return gulp.watch(['./src/style.css', './src/script.js', './src/**/*.html']).on('change', bs.reload);
})));
