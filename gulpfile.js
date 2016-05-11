/* jshint esnext: true */
/* globals require */


const gulp                  = require('gulp');
const addSrc                = require('gulp-add-src');
const autoprefixer          = require('gulp-autoprefixer');
const concat                = require('gulp-concat');
const del                   = require('del');
const header                = require('gulp-header');
const jscs                  = require('gulp-jscs');
// const jsdoc                 = require('gulp-jsdoc');
const jshint                = require('gulp-jshint');
const jshintStylishReporter = require('jshint-stylish');
const merge                 = require('merge-stream');
const minifyCss             = require('gulp-minify-css');
const path                  = require('path');
const rename                = require('gulp-rename');
const replace               = require('gulp-replace');
const runSequence           = require('run-sequence');
const sass                  = require('gulp-ruby-sass');
const scssLint              = require('gulp-scss-lint');
const sourcemaps            = require('gulp-sourcemaps');
const uglify                = require('gulp-uglify');
const util                  = require('gulp-util');
const wrapUMD               = require('gulp-wrap-umd');



// ------------------------- //
// Helpers                   //
// ------------------------- //

String.EMPTY = '';
String.SPACE = ' ';


function noop() {
  // Intentionally left blank!
}


function onError(err) {
  util.log(util.colors.red(err.message));
}




// ------------------------- //
// Configuration             //
// ------------------------- //

var config = {
  pkg: require('./package.json'),

  build: {
    dir:       'build/',
    sassCache: {},
  },
  dist: {
    dir:    'dist/',
    styles: { dir: 'dist/styles/' }
  },
  docs: { dir: 'docs/' },
  lint: {},
  reports: { dir: 'reports/' },
  src: {
    dir:     'src/',
    selector: {}
  },
  tests: { dir: 'test/' },

  umd: {
    deps:      [],
    namespace: 'MultiSelectDropdown'
  }
};

config.build.sassCache.dir = '.sass-cache';

config.fileHeader = "/*!\n * multi-select-dropdown.js (" + config.pkg.version + ")\n *\n * Copyright (c) " + (new Date()).getFullYear() + " Brandon Sara (http://bsara.github.io)\n * Licensed under the CPOL-1.02 (https://github.com/bsara/multi-select-dropdown.js/blob/master/LICENSE.md)\n */\n";

config.src.selector = {
  scripts:       path.join(config.src.dir, '*.js'),
  manager:       path.join(config.src.dir, 'multi-select-dropdown-manager.js'),
  internalUtils: path.join(config.src.dir, 'msd-internal-utils.js'),

  styles:   path.join(config.src.dir, '**', '*.scss'),
  scssMain: path.join(config.src.dir, 'multi-select-dropdown.scss'),

  tests:   path.join(config.tests.dir, '**', '*.js')
};
config.src.selector.observableArray = [
  config.src.selector.internalUtils,
  path.join(config.src.dir, 'msd-observable-array.js')
];
config.src.selector.element = config.src.selector.observableArray.concat([
  path.join(config.src.dir, 'multi-select-dropdown-element.js')
]);
config.src.selector.notScssMain = [
  config.src.selector.styles,
  ('!' + config.src.selector.scssMain)
];

config.lint.selectors = {
  scripts: [
    'gulpfile.js',
    config.src.selector.scripts,
    config.src.selector.tests
  ],
  styles: [
    config.src.selector.styles
  ]
};




// ------------------------- //
// Tasks                     //
// ------------------------- //

gulp.task('default', [ 'help' ]);



gulp.task('help', function() {
  var header = util.colors.bold.blue;
  var task   = util.colors.green;

  console.log(String.EMPTY);
  console.log(header("MultiSelectDropdown.js Gulp Tasks"));
  console.log(header("------------------------------------------------------------------------------"));
  console.log("  " + task("help") + " (" + util.colors.yellow("default") + ") - Displays this message.");
  console.log(String.EMPTY);
  console.log("  " + task("build") + "          - Builds the project.");
  console.log("  " + task("rebuild") + "        - Cleans the build folder, then builds the project.");
  // console.log("  " + task("docs") + "           - Generates documentation based on inline JSDoc comments.");
  console.log("  " + task("dist") + "           - Performs all needed tasks to prepare the built project");
  console.log("                   for a new release.");
  // console.log(String.EMPTY);
  // console.log("  " + task("test") + "           - Runs the project's tests.");
  console.log(String.EMPTY);
  console.log("  " + task("clean") + "          - Runs all available cleaning tasks in parallel.");
  console.log("  " + task("clean:build") + "    - Cleans the build output directory.");
  // console.log("  " + task("clean:docs") + "     - Cleans the documentation output directory.");
  console.log("  " + task("clean:dist") + "     - Cleans the distribution output directory.");
  console.log("  " + task("clean:reports") + "  - Cleans the reports output directory.");
  console.log(String.EMPTY);
  console.log("  " + task("lint") + "           - Runs all available linting tasks in parallel.");
  console.log("  " + task("lint:scripts") + "   - Runs all available linting tasks pertaining to JavaScript source files.");
  console.log("  " + task("lint:styles") + "    - Runs all available linting tasks pertaining to stylesheet source files.");
  console.log("  " + task("jshint") + "         - Runs JSHint on the project source files.");
  console.log("  " + task("jscs") + "           - Runs JSCS on the project source files.");
  console.log("  " + task("scssLint") + "       - Runs scss-lint on the project source files.");
  console.log(String.EMPTY);
});



// Build Tasks
// ----------------

gulp.task('build', [ 'build:scripts', 'build:styles' ]);


gulp.task('build:scripts', function() {
  var all = gulp.src(config.src.selector.scripts)
                .pipe(concat('multi-select-dropdown.js'))
                .pipe(wrapUMD({
                  deps:      config.umd.deps,
                  namespace: config.umd.namespace,
                  exports:   '{\n'
                           + '  MultiSelectDropdownManager: MultiSelectDropdownManager,\n'
                           + '  MultiSelectDropdownElement: MultiSelectDropdownElement,\n'
                           + '}'
                }));

  var element = gulp.src(config.src.selector.element)
                    .pipe(concat('multi-select-dropdown-element.js'))
                    .pipe(wrapUMD({
                      deps:      config.umd.deps,
                      namespace: 'MultiSelectDropdownElement',
                      exports:   'MultiSelectDropdownElement'
                    }))
                    .pipe(gulp.dest(config.build.dir));

  return merge(all, element)
           .pipe(replace(/\s*\/\/\s*js(hint\s|cs:).*$/gmi, String.EMPTY))
           .pipe(replace(/\s*\/\*\s*(js(hint|lint|cs:)|global(|s)|exported)\s.*?\*\/\s*\n/gmi, String.EMPTY))
           .pipe(header(config.fileHeader))
           .pipe(gulp.dest(config.build.dir));
});


gulp.task('build:styles', function() {
  var css = sass(path.join(config.src.selector.scssMain), {
                 force:        true,
                 noCache:      true,
                 sourcemap:    false,
                 style:        'expanded',
                 unixNewlines: true
               }).on('error', onError)
               .pipe(autoprefixer({
                 browsers: [ 'last 2 versions' ],
                 remove:   true
               }))
               .pipe(gulp.dest(config.build.dir));

  var origSCSS = gulp.src(config.src.selector.scssMain)
                     .pipe(rename({ prefix: '_' }))
                     .pipe(addSrc(config.src.selector.notScssMain));

  return merge(css, origSCSS)
           .pipe(header(config.fileHeader))
           .pipe(gulp.dest(config.build.dir));
});


gulp.task('rebuild', function(callback) {
  return runSequence('clean:build', 'build', callback);
});


gulp.task('dist', [ 'clean:build', 'clean:dist' ], function(callback) {
  return runSequence('lint', 'test', 'build', function(err) {
    if (err) {
      callback(err);
      return;
    }


    var scripts = gulp.src(path.join(config.build.dir, '*.js'))
                 .pipe(gulp.dest(config.dist.dir))
                 .pipe(sourcemaps.init())
                 .pipe(uglify({ preserveComments: 'some' }))
                 .pipe(rename({ suffix: '.min' }))
                 .pipe(sourcemaps.write('.', { sourceRoot: null }))
                 .pipe(gulp.dest(config.dist.dir));

    var styles = gulp.src(path.join(config.build.dir, '*.css'))
                     .pipe(gulp.dest(config.dist.styles.dir))
                     // .pipe(sourcemaps.init())
                     .pipe(minifyCss())
                     .pipe(rename({ suffix: '.min' }))
                     // .pipe(sourcemaps.write('.', { sourceRoot: null }))
                     .pipe(addSrc(path.join(config.build.dir, '*.scss')))
                     .pipe(gulp.dest(config.dist.styles.dir));


    var ret = merge(scripts, styles);

    callback();

    return ret;
  });
});


// gulp.task('docs', [ 'clean:docs' ], function() {
//   // TODO: Add CSS docs!!!
//   // TODO: Add SCSS docs!!!
//
//   return gulp.src([ config.src.selector.scripts, 'README.md' ])
//              .pipe(jsdoc.parser(null, 'MultiSelectDropdown.js'))
//              .pipe(jsdoc.generator(config.docs.dir));
// });



// Test Tasks
// ----------------

gulp.task('test', function() {
  util.log(util.colors.yellow("Tests are not yet implemented!"));
});



// Clean Tasks
// ----------------

gulp.task('clean', [ 'clean:build', 'clean:dist', 'clean:docs', 'clean:reports' ]);


gulp.task('clean:build', function() {
  return del(config.build.dir);
});


gulp.task('clean:dist', function() {
  return del(config.dist.dir);
});


gulp.task('clean:docs', function() {
  return del(config.docs.dir);
});


gulp.task('clean:reports', function() {
  return del(config.reports.dir);
});



// Lint Tasks
// ----------------

gulp.task('lint', [ 'lint:scripts', 'lint:styles' ]);


gulp.task('lint:scripts', [ 'jshint', 'jscs' ]);


gulp.task('jshint', function() {
  return gulp.src(config.lint.selectors.scripts)
             .pipe(jshint())
             .pipe(jshint.reporter(jshintStylishReporter, { verbose: true }))
             .pipe(jshint.reporter('fail', { verbose: true }));
});


gulp.task('jscs', function() {
  return gulp.src(config.lint.selectors.scripts)
             .pipe(jscs({ verbose: true }));
});


gulp.task('lint:styles', [ 'scssLint']);


gulp.task('scssLint', function() {
  return sass(config.lint.selectors.styles, {
           check:       true,
           stopOnError: true,
           noCache:     true
         }).on('error', onError);
         // .pipe(scssLint()); // TODO: Fix scssLint!!!
});

