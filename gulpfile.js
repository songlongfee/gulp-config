var gulp = require('gulp');
var less = require('gulp-less'); //编译less
var cssmin = require('gulp-minify-css'); //压缩css
var imgmin = require('gulp-imagemin'); //图片压缩
var pngquant = require('imagemin-pngquant'); //深度压缩
var concat = require('gulp-concat'); //合并文件
var uglify = require('gulp-uglify'); //压缩js
var rename = require('gulp-rename'); //文件重命名
var autoprefixer = require('gulp-autoprefixer'); //添加浏览器前缀
var babel = require('gulp-babel'); //编译ES6
var sourcemaps = require('gulp-sourcemaps'); //源码映射
var livereload = require('gulp-livereload'); // 页面热重载
var webserver = require('gulp-webserver'); // 本地服务器
var changed = require('gulp-changed'); //增量编译
var clean = require('gulp-clean'); // 文件清理

gulp.task('html', function () {
    gulp.src('./src/*.html')
        .pipe(changed('./dist'))
        .pipe(gulp.dest('./dist')) //开发环境HTML移至发布环境
});

gulp.task('webserver', function () { //开启本地服务
    gulp.src('.')
        .pipe(webserver({
            livereload: true,
            open: true
        }))
});

gulp.task('less', function() {
    gulp.src('./src/less/*.less')
        .pipe(changed('./dist/css'))
        .pipe(less())  //编译less
        .pipe(autoprefixer({  //添加浏览器前缀
            browsers: ['last 4 versions', 'Android >= 4.0'],
            cascade: true, //是否美化对齐
            remove: true //是否去除不必要的前缀
        }))
        .pipe(cssmin())
        .pipe(gulp.dest('./dist/css'));
});

gulp.task('img', function() {
    gulp.src('./src/images/*.{png,jpg,gif,svg}')
        .pipe(changed('./dist/images'))
        .pipe(imgmin({
            progressive: false, //无损压缩jpg
            use: [pngquant()]
        }))
        .pipe(gulp.dest('./dist/images'))
});

gulp.task('babel', function() {  //编译es6
    gulp.src(['./src/js/core/*.js','!*.min.js'])
        .pipe(changed('./dist/js/core'))
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(sourcemaps.init())
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(sourcemaps.write('maps'))
        .pipe(gulp.dest('./dist/js/core'))
    gulp.src('./src/js/lib/*.js')
        .pipe(changed('./dist/js/lib'))
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(sourcemaps.init())
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(sourcemaps.write('maps'))
        .pipe(gulp.dest('./dist/js/lib'))
    gulp.src('./src/js/ui/*.js')
        .pipe(changed('./dist/js/ui'))
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(sourcemaps.init())
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(sourcemaps.write('maps'))
        .pipe(gulp.dest('./dist/js/ui'))
});

gulp.task('clean', function () {
    gulp.src(['dist/css/maps', 'dist/js/maps'], {read: false})
        .pipe(clean()) //文件清理
});

gulp.task('watch', ['html', 'less', 'img', 'babel'], function() { //自动监听编译
    gulp.watch('./src/*.html', ['html']);
    gulp.watch('./src/less/*.less', ['less']);
    gulp.watch('./src/images/*.{png,jpg,gif,svg}', ['img']);
    gulp.watch('./src/js/../*.js', ['babel']);
});

gulp.task('default', ['webserver', 'watch']);
