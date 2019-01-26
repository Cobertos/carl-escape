const gulp = require("gulp");
const sass = require("gulp-sass");
const cleanCSS = require('gulp-clean-css');
const webpack = require('webpack');
const WebpackMessages = require('webpack-messages');
const gulpWebpack = require('webpack-stream');
const browserSync = require('browser-sync').create();
const path = require("path");

const SRC_DIR = "src"; //Source directory
const DIST_DIR = "docs"; //Distribution directory

gulp.task(function scss(){
    return gulp.src(SRC_DIR + '/scss/main.scss')
        .pipe(sass().on('error', sass.logError))
        //Minify and optimize
        /*.pipe(cleanCSS({debug: true}, (details) => {
          console.log(details.name + ": " + details.stats.originalSize);
          console.log(details.name + ": " + details.stats.minifiedSize);
        }))*/
        .pipe(gulp.dest( DIST_DIR + "/css" ))
        .pipe(browserSync.stream());
});

gulp.task(function js(){
    let webpackConfig = require("./webpack.config.js");
    webpackConfig.plugins = [
        //Show webpack stats messages (TODO: Make our own _cool_ one)
        new WebpackMessages({
          name: "WEBPACK BUILD",
          logger: str => console.log(`| ${str}`)
        })
    ];

    return gulp.src("./src/js/main.js")
        .pipe(gulpWebpack( webpackConfig, webpack ))
        .pipe(gulp.dest( DIST_DIR + "/js" ));
});

gulp.task(function serve(){
    browserSync.init({
        server: {
            port: 10101,
            baseDir: DIST_DIR
        }
    });
});

//TODO: Readd prod build
gulp.task("build", gulp.parallel("js", "scss"));
gulp.task(function watch(){
    gulp.watch(SRC_DIR + "/**/*.scss", gulp.task("scss"));
    gulp.watch(SRC_DIR + "/**/*.js", gulp.series("js", function reload(done){
        browserSync.reload();
        done();
    }));
});
gulp.task("dev", gulp.series("build", gulp.parallel("watch", "serve")));
gulp.task("default", gulp.task("dev"));
