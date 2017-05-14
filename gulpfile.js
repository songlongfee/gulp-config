var gulp = require('gulp');
var less = require('gulp-less'); //编译less
var concat = require('gulp-concat'); //合并文件
var uglify = require('gulp-uglify'); //压缩文件
var rename = require('gulp-rename'); //文件重命名
var autoprefixer = require('gulp-autoprefixer'); //添加浏览器前缀
var babel = require('gulp-babel'); //编译ES6 => ES5

gulp.task('less', function() {  //编译less => css
    gulp.src('./less/*.less')
        .pipe(less())
        .pipe(gulp.dest('./css'));
});

gulp.task('scripts', function() {  //js文件合并、压缩
    gulp.src('./js/*.js')
        .pipe(concat('all.js'))
        .pipe(gulp.dest('./dist'))
        .pipe(rename('all.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./dist'));
});

gulp.task('autoprefix', function() {  //添加浏览器前缀
    gulp.src('./prefix/*.css')
        .pipe(autoprefixer({
            browsers: ['last 3 versions', 'Android >= 4.0'],
            cascade: true, //是否美化对齐
            remove: true //是否去除不必要的前缀
        }))
        .pipe(gulp.dest('./postcss'));
});

gulp.task('babel', function() {
    gulp.src('./es6/*.js')
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest('es5'))
});

gulp.task('default', function() { //自动监听、实时编译
    gulp.run('less', 'scripts', 'autoprefix');
    gulp.watch('./js/*.js', function() {
        gulp.run('scripts');
    });
    gulp.watch('./less/*.less', function() {
        gulp.run('less');
    });
    gulp.watch('./prefix/*.css', function() {
        gulp.run('autoprefix');
    });
});
