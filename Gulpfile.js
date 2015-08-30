var gulp = require('gulp');
var babel = require('gulp-babel');
var sourcemaps = require('gulp-sourcemaps');
var livereload = require('gulp-livereload');
var run = require('gulp-run');

var paths = {
  globs: {
    electronScripts: 'electron/js/**/*.js',
    electronAssets: ['electron/**/*.html', 'electron/**/*.json'],
    libScripts: 'lib/**/*.js',
    tests: 'test/**/*.js',
    views: 'frontend/views/**/*.hbs',
    styles: 'frontend/styles/**/*.css',
    clientScripts: 'frontend/client/**/*.js',
    icons: 'frontend/icons/*.svg',
    iconFonts: 'frontend/icons/fonts/**/*'
  },
  dirs: {
    build: {
      libScripts: 'dist/',
      electronScripts: 'dist/electron/js/',
      electronRoot: 'dist/electron/',
    }
  }
};

gulp.task('electron:scripts', function() {
  return gulp.src(paths.globs.electronScripts)
    .pipe(sourcemaps.init())
    .pipe(babel())
    .on('error', console.error.bind(console))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.dirs.build.electronScripts))
    .pipe(livereload());
});

gulp.task('lib:scripts', function() {
  return gulp.src(paths.globs.libScripts)
    .pipe(sourcemaps.init())
    .pipe(babel())
    .on('error', console.error.bind(console))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.dirs.build.libScripts))
    .pipe(livereload());
});

gulp.task('electron:assets', function() {
  return gulp.src(paths.globs.electronAssets)
    .pipe(gulp.dest(paths.dirs.build.electronRoot))
    .pipe(livereload());
});

gulp.task('electron:run', [], function() {
  livereload.listen();
  return run('electron ' + paths.dirs.build.electronRoot).exec();
});

gulp.task('client:scripts:test', function(cb) {
  karma.start({
    configFile: paths.files.karmaConf,
    singleRun: true
  }, cb);
});

gulp.task('electron:watch', function() {
  return gulp.watch([ paths.globs.electronScripts ], ['electron:build']);
});

gulp.task('lib:watch', function() {
  return gulp.watch([ paths.globs.libScripts ], ['lib:scripts']);
});

gulp.task('watch', ['lib:watch', 'electron:watch']);

gulp.task('electron:build', ['electron:scripts', 'electron:assets', 'lib:scripts']);
gulp.task('electron:dev', ['electron:build', 'electron:run', 'watch'])

gulp.task('dev', ['build', 'server:dev']);

gulp.task('release', ['build', 'client:scripts']);
gulp.task('default', ['dev']);
