const { src, dest, watch } = require("gulp");
const rename = require("gulp-rename");
const webpack = require("webpack");
const webpackStream = require("webpack-stream");
const minifyHTML = require("gulp-htmlmin");
const minifyCSS = require("gulp-uglifycss");
const image = require("gulp-image");
const sass = require("gulp-sass");
const sourcemaps = require("gulp-sourcemaps");
const livereload = require("gulp-livereload");

sass.compiler = require("node-sass");

function html() {
  return src("src/*.html")
    .pipe(minifyHTML({ collapseWhitespace: true }))
    .pipe(dest("dist/"));
}

function js() {
  return src("src/assets/js/*.js")
    .pipe(
      webpackStream(
        {
          devtool: "source-map",
          config: require("./webpack.config")
        },
        webpack
      )
    )
    .pipe(dest("dist/assets/js/"));
}

function css() {
  return src("src/assets/css/*css")
    .pipe(
      minifyCSS({
        maxLineLen: 80,
        uglyComments: true
      })
    )
    .pipe(rename({ extname: ".min.css" }))
    .pipe(dest("dist/assets/css/"));
}

function convertSass() {
  return src("src/assets/scss/*.scss")
    .pipe(sourcemaps.init())
    .pipe(sass({ outputStyle: "compressed" }).on("error", sass.logError))
    .pipe(rename({ extname: ".min.css" }))
    .pipe(sourcemaps.write())
    .pipe(dest("dist/assets/css/"));
}

function optimizeImg() {
  return src([
    "src/assets/img/*.png",
    "src/assets/img/*.jpg",
    "src/assets/img/*.svg",
    "src/assets/img/*.webp"
  ])
    .pipe(image())
    .pipe(dest("dist/assets/img/"));
}

function optimizeMedia() {
  return src(["src/media/*.png", "src/media/*.jpg", "src/media/*.webp"])
    .pipe(image())
    .pipe(dest("dist/media/"));
}

exports.default = () => {
  livereload.listen({ start: true });
  watch("src/*.html", { ignoreInitial: false }, html);
  watch("src/assets/scss/*.scss", { ignoreInitial: false }, convertSass);
  watch("src/assets/css/*.css", { ignoreInitial: false }, css);
  watch("src/assets/js/*.js", { ignoreInitial: false }, js);
  watch("src/assets/img/**", { ignoreInitial: false }, optimizeImg);
  watch("src/media/**", { ignoreInitial: false }, optimizeMedia);
};
