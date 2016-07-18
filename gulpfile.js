var gulp = require('gulp');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
const gulpLoadPlugins = require('gulp-load-plugins')
const $ = gulpLoadPlugins();
// BrowserSync
gulp.task('browsersync', ['watch'], function () {
    browserSync({
        server: {
            baseDir: './app'
        },
        port: 184,
        notify: false,
    });
});
// Watch JS/JSX and Sass files
gulp.task('watch', function () {
    gulp.watch(['app/components/*.js', 'app/js/*.js', 'app/stores/*.js']).on('change', reload);
    gulp.watch("app/*.html").on('change', reload);
});
gulp.task('serve', ['browsersync']);

//====add dist 

var onError = function (err) {
    $.notify.onError({
        title: "Error",
        message: "<%= error %>",
    })(err);
    this.emit('end');
};

var plumberOptions = {
    errorHandler: onError,
};

gulp.task('test', function () {
    return gulp.src([
        'app/components/pingPanel.jsx'
    ])
        .pipe($.sourcemaps.init())
        .pipe($.react())
        .pipe($.concat('pingPanel.js'))
        .pipe($.sourcemaps.write('./'))
        .pipe(gulp.dest('dist/pingPanel'));

});

gulp.task('eslint', function () {
    return gulp.src(['app/stores/pingStore.js', 'app/js/index.js', 'app/components/pingPanel.js'])
        .pipe($.plumber(plumberOptions))
        .pipe($.concat('compLint.js'))
        .pipe($.eslint({ configFle: "./.eslintrc" }))
        .pipe($.eslint.format())
        .pipe($.newer('.tmp'))
        .pipe(gulp.dest('.tmp'));
});

gulp.task('comp', ['eslint'], function () {
    return gulp.src([
        'app/components/pingPanel.js'
    ])
        .pipe($.sourcemaps.init())
        .pipe($.react())
        .pipe($.concat('pingPanel.js'))
        .pipe($.sourcemaps.write('./'))
        .pipe($.newer('.tmp/dist'))
        .pipe(gulp.dest('.tmp/dist'));
});

gulp.task('jsConcat', ['comp'], function () {
    return gulp.src([
        'node_modules/react/dist/react.min.js'
        , 'node_modules/react-dom/dist/react-dom.min.js'
        , 'node_modules/reflux/dist/reflux.min.js'

        , 'app/stores/pingStore.js'
        , '.tmp/dist/pingPanel.js'
        , 'app/js/index.js'
    ])
        .pipe($.plumber(plumberOptions))
        .pipe($.sourcemaps.init())
        .pipe($.concat('jsConcat.js'))
        .pipe($.sourcemaps.write('./'))
        .pipe($.newer('.tmp/dist'))
        .pipe(gulp.dest('.tmp/dist'));
});

gulp.task('js', ['jsConcat'], function () {
    return gulp.src([
        //'jsConcat.js'
        '.tmp/dist/jsConcat.js'
    ])
        .pipe($.plumber(plumberOptions))
        .pipe($.sourcemaps.init())
        .pipe($.concat('app.min.js'))
        .pipe($.uglify())
        .pipe($.sourcemaps.write('./'))
        .pipe($.newer('dist'))
        .pipe(gulp.dest('dist'))
        .pipe(reload({ stream: true }));
});

gulp.task('clean', function () {
    return gulp.src([
        '.tmp', 'dist'
    ])
        .pipe($.clean());

});

gulp.task('index:dist', function () {
    return gulp.src([
        'app/index.dist.html'
    ])
        .pipe($.plumber(plumberOptions))
        .pipe($.rename('index.html'))
        .pipe($.htmlmin({ collapseWhitespace: true }))
        .pipe($.newer('dist'))
        .pipe(gulp.dest('dist'));
});

// BrowserSync
gulp.task('browsersync:dist', ['comp', 'watch'], function () {
    browserSync({
        server: {
            baseDir: './dist'
        },
        port: 186,
        notify: false,
    });
});
// Watch JS/JSX and Sass files
gulp.task('watch', function () {
    gulp.watch(['app/components/*.js', 'app/js/*.js', 'app/stores/*.js'], ['js']);
    gulp.watch("app/*.html").on('change', reload);
    //gulp.watch('css/**/*.css', ['css']);
});


gulp.task('build', [ 'index:dist', 'js']);

gulp.task('serve:dist', ['build', 'browsersync:dist']);

