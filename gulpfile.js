const { src, dest, watch, parallel, series } = require("gulp");
// helpers
const argv = require("yargs").argv;
const gulpif = require("gulp-if");
const rename = require("gulp-rename");
const del = require("del");
const gzip = require("gulp-gzip");
const sitemap = require("gulp-sitemap");
const sitemapConfig = require("./sitemap.config");
const save = require("gulp-save");
const browserSync = require("browser-sync").create();
// html
const htmlmin = require("gulp-htmlmin");
// js
const webpack = require("webpack-stream");
const webpackConfig = require("./webpack.config");
// css
const sass = require("gulp-sass");
const autoprefixer = require("autoprefixer");
const postcss = require("gulp-postcss");
const cssnano = require("gulp-uglifycss");
const sourcemaps = require("gulp-sourcemaps");
// images
const imagemin = require("gulp-imagemin");
const imagewebp = require("gulp-webp");
const imageResize = require("gulp-image-resize");

async function clean() {
  return await del("./dist");
}

function html() {
  return src("./src/**/*.html")
    .pipe(gulpif(argv.production, htmlmin({ collapseWhitespace: true })))
    .pipe(gulpif(argv.gzip, gzip()))
    .pipe(dest("./dist/"));
}

function js() {
  return src("./src/assets/js/**/*.js")
    .pipe(webpack({ devtool: "source-map", config: webpackConfig }))
    .pipe(rename({ extname: ".min.js" }))
    .pipe(gulpif(argv.gzip, gzip()))
    .pipe(dest("./dist/assets/js/"));
}

function css() {
  if (argv.production) {
    return src(["./src/assets/sass/**/*.scss", "./src/assets/css/**/*.css"])
      .pipe(sourcemaps.init())
      .pipe(sass().on("error", sass.logError))
      .pipe(postcss([autoprefixer()]))
      .pipe(cssnano())
      .pipe(rename({ extname: ".min.css" }))
      .pipe(sourcemaps.write("./"))
      .pipe(gulpif(argv.gzip, gzip()))
      .pipe(dest("./dist/assets/css/"));
  } else {
    return src(["./src/assets/sass/**/*.scss", "./src/assets/css/**/*.css"])
      .pipe(sass().on("error", sass.logError))
      .pipe(postcss([autoprefixer()]))
      .pipe(rename({ extname: ".min.css" }))
      .pipe(dest("./dist/assets/css/"));
  }
}

function images() {
  return imageDefault(
    [
      "./src/assets/img/**/*.png",
      "./src/assets/img/**/*.jpg",
      "./src/assets/img/**/*.svg",
    ],
    "./dist/assets/img/"
  );
}

function imageDefault(source, destination) {
  return src(source)
    .pipe(imagemin())
    .pipe(gulpif(argv.gzip, save("before-gzip")))
    .pipe(gulpif(argv.gzip, gzip()))
    .pipe(dest(destination))
    .pipe(gulpif(argv.gzip, save.restore("before-gzip")))
    .pipe(imagewebp())
    .pipe(gulpif(argv.gzip, gzip()))
    .pipe(dest(destination));
}

function aboutResizeImage() {
  return src([
    `./src/media/about/*.png`,
    `./src/media/about/*.jpg`,
    `./src/media/about/*.svg`,
  ])
    .pipe(
      imageResize({
        width: 300,
        height: 188,
        cover: true,
      })
    )
    .pipe(rename({ suffix: "-300x188" }))
    .pipe(imagemin())
    .pipe(gulpif(argv.gzip, save("before-gzip")))
    .pipe(gulpif(argv.gzip, gzip()))
    .pipe(dest("./dist/media/about/"))
    .pipe(gulpif(argv.gzip, save.restore("before-gzip")))
    .pipe(imagewebp())
    .pipe(gulpif(argv.gzip, gzip()))
    .pipe(dest("./dist/media/about/"));
}

function projectsResizeImage() {
  return src([
    `./src/media/projects/*.png`,
    `./src/media/projects/*.jpg`,
    `./src/media/projects/*.svg`,
  ])
    .pipe(
      imageResize({
        width: 230,
        height: 144,
        cover: true,
      })
    )
    .pipe(rename({ suffix: "-230x144" }))
    .pipe(imagemin())
    .pipe(gulpif(argv.gzip, save("before-gzip")))
    .pipe(gulpif(argv.gzip, gzip()))
    .pipe(dest("./dist/media/projects/"))
    .pipe(gulpif(argv.gzip, save.restore("before-gzip")))
    .pipe(imagewebp())
    .pipe(gulpif(argv.gzip, gzip()))
    .pipe(dest("./dist/media/projects/"));
}

async function media() {
  const folders = [
    "about",
    "background",
    "clients",
    "projects",
    "team",
    "premium",
  ];
  /** Minify and Convert WebP */
  folders.forEach((folder) => {
    imageDefault(
      [
        `./src/media/${folder}/*.png`,
        `./src/media/${folder}/*.jpg`,
        `./src/media/${folder}/*.svg`,
      ],
      `./dist/media/${folder}/`
    );
  });

  aboutResizeImage();
  projectsResizeImage();

  return;
}

function htaccess() {
  src("./src/media/.htaccess", {
    dot: true,
  }).pipe(dest("./dist/media/"));

  src("./src/assets/.htaccess", {
    dot: true,
  }).pipe(dest("./dist/assets/"));

  return;
}

function screenshot() {
  return src("./src/awax.png").pipe(dest("./dist/"));
}

function config() {
  htaccess();
  createSitemap();
  screenshot();
  return;
}

function createSitemap() {
  const { siteUrl, pages } = sitemapConfig;
  let mappings = [];
  for (const page in pages) {
    if (pages.hasOwnProperty(page)) {
      let map = {
        pages: [`${page}`],
        changefreq: `${pages[page].changefreq}`,
        priority: `${pages[page].priority}`,
      };
      mappings = [...mappings, map];
    }
  }

  return src("./dist/**/*.html", {
    read: false,
  })
    .pipe(
      sitemap({
        siteUrl,
        mappings,
        getLoc(siteUrl, loc, entry) {
          return loc.replace(/\.\w+$/, "");
        },
      })
    )
    .pipe(dest("./dist/"));
}

function server() {
  browserSync.init({
    server: {
      baseDir: "./dist/",
      index: "index.html",
    },
  });
  // html
  watch("./src/**/*.html", { ignoreInitial: false }, html).on(
    "change",
    browserSync.reload
  );
  watch("./src/assets/js/**/*.js", { ignoreInitial: false }, js).on(
    "change",
    browserSync.reload
  );
  watch(
    ["./src/assets/sass/**/*.scss", "./src/assets/css/**/*.css"],
    { ignoreInitial: false },
    css
  ).on("change", browserSync.reload);
  watch("./src/assets/img/**/*.*", { ignoreInitial: false }, images).on(
    "change",
    browserSync.reload
  );
  watch("./src/media/**/*.*", { ignoreInitial: false }, media).on(
    "change",
    browserSync.reload
  );
}

exports.html = html;
exports.clean = clean;
exports.css = css;
exports.js = js;
exports.images = images;
exports.media = media;
exports.config = config;
exports.createSitemap = createSitemap;

if (argv.production) {
  exports.default = series(
    clean,
    parallel(html, css, js, images, media),
    config
  );
} else {
  exports.default = series(
    clean,
    parallel(html, css, js, images, media),
    server
  );
}
