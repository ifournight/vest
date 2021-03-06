const gulpSass = require('gulp-sass')
const gulpRename = require('gulp-rename')
const gulpReplace = require('gulp-replace')
const gulpPlumber = require('gulp-plumber')
const sassPackageImporter = require('node-sass-package-importer')
const {template, sassProjectImporter, resolvePath} = require('../utils')

module.exports = function(gulp) {
  gulp.task(`${this.config.name}:sass`, () => {
    this.log(`start compiling scss files...`)
    return gulp.src(this.sassGlobs)
      .pipe(gulpPlumber())
      .pipe(template(this.config))
      .pipe(gulpSass({
        includePaths: [this.config.srcPath],
        importer: [
          sassProjectImporter(this.config),
          sassPackageImporter({
            cwd: this.config.cwd
          })
        ]
      }))
      .pipe(resolvePath())
      .pipe(gulpReplace(/\/\*=\s+import\s+'(.+)'\s+\*\//g, '@import \'$1\';'))
      .pipe(gulpRename({
        extname: ".wxss"
      }))
      .pipe(gulp.dest(this.config.distPath))
      .on('finish', () => this.log(`finish compiling scss files.`))
  })
}
