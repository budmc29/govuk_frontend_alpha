'use strict'

const packageJson = require('../../package.json')
const paths = require('../../config/paths.json')
const packageName = require('../../gulpfile.js').packageName

const gulp = require('gulp')
const runSequence = require('run-sequence')
const run = require('gulp-run')
const del = require('del')

gulp.task('package:gem', cb => {
  runSequence('package:gem:prepare', 'package:gem:build', 'package:gem:copy', 'package:gem:clean', cb)
})

gulp.task('package:gem:prepare', () => {
  gulp.src(paths.bundleCss + '**/*').pipe(gulp.dest(paths.gemCss))
  gulp.src(paths.bundleImg + '**/*').pipe(gulp.dest(paths.gemImg))
  gulp.src(paths.bundleScss + '**/*').pipe(gulp.dest(paths.gemScss))
  gulp.src(paths.bundleJs + '**/*').pipe(gulp.dest(paths.gemJs))
  gulp.src(paths.bundleTemplates + '**/*').pipe(gulp.dest(paths.gemTemplates))
  return gulp.src(`${paths.lib}packaging/gem/${packageJson.name}.gemspec`).pipe(gulp.dest(paths.gem))
})

gulp.task('package:gem:build', () => run(`cd ${paths.gem} && gem build ${packageJson.name}.gemspec`).exec())
gulp.task('package:gem:copy', () => gulp.src(`${paths.gem}${packageName}.gem`).pipe(gulp.dest(paths.pkg)))
gulp.task('package:gem:clean', () => del(`${paths.gem}${packageName}.gem`))
