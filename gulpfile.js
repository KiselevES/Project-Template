var gulp = require('gulp'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglifyjs'),
    cssnano = require('gulp-cssnano'),
    rename = require('gulp-rename'),
    clear = require('del'),
    autoprefixer = require('gulp-autoprefixer'),
    sourceMaps = require('gulp-sourcemaps'),
    stripCssComments = require('gulp-strip-css-comments'),
    spritesmith = require('gulp.spritesmith');

gulp.task('sass', function () {
    return gulp.src('app/scss/**/*.scss')
        .pipe(sourceMaps.init())
        .pipe(sass())
        .pipe(autoprefixer(['last 15 versions']))
        .pipe(cssnano())
        .pipe(sourceMaps.write())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('app/css'))
        .pipe(browserSync.reload({stream: true}))
});

gulp.task('browser-sync', function () {
    browserSync({
        server: {
            baseDir: 'app'
        },
        notify: false
    });
});

gulp.task('code', function () {
    return gulp.src('app/*.html')
        .pipe(browserSync.reload({stream: true}))
});

gulp.task('myScripts', function () {
    return gulp.src('app/js/**/*.js')
        .pipe(browserSync.reload({stream: true}))
});

gulp.task('scripts', function () {
    return gulp.src([
        'node_modules/jquery/dist/jquery.min.js'
    ])
        .pipe(concat('libs.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('app/js'))
});

gulp.task('spritesmith', async function () {
    var spriteData = gulp.src('app/sprites/**/*')
        .pipe(spritesmith({
            imgName: 'sprite.png',
            cssName: '_sprite.css' //необходимо отредактировать пути к спрайтам
        }));
    spriteData.img.pipe(gulp.dest('app/img/'));
    spriteData.css.pipe(gulp.dest('app/sass/import/'));
});

gulp.task('clean', async function () {
    return clear.sync('dist')
});

gulp.task('build', async function () {
    gulp.src('app/css/main.min.css')
        .pipe(stripCssComments())
        .pipe(gulp.dest('dist/css'));

    gulp.src('app/fonts/**/*')
        .pipe(gulp.dest('dist/fonts'));

    gulp.src('app/js/**/*')
        .pipe(gulp.dest('dist/js'));

    gulp.src('app/*.html')
        .pipe(gulp.dest('dist'));

    gulp.src('app/img/**/*')
        .pipe(gulp.dest('dist'));
});

gulp.task('watch', function () {
    gulp.watch('app/scss/**/*.scss', gulp.parallel('sass'));
    gulp.watch('app/*.html', gulp.parallel('code'));
    gulp.watch('app/js/**/*.js', gulp.parallel('myScripts'));
});

gulp.task('rebuild', gulp.series('clean', 'build'));

gulp.task('default', gulp.parallel('sass', 'scripts', 'myScripts', 'browser-sync', 'watch'));