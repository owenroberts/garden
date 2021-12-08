const { src, dest, watch, series, parallel, task } = require('gulp');
const doodoo = require('./doodoo/gulpfile');
console.log(doodoo.files);

// const webpack = require('webpack-stream');
const sourcemaps = require('gulp-sourcemaps');
const browserSync = require('browser-sync').create();
const notify = require('gulp-notify');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;

function browserSyncTask() {
	browserSync.init({
		port: 8080,
		server: {
			baseDir: './',
		}
	});
}

function reload(done) {
	browserSync.reload();
	done();
}

const jsFiles = [
	'./src/Charon.js',
	'./src/Pilgrim.js',
	'./src/garden.js',
];

const libFiles = [
	'./doodoo/build/doodoo.min.js',
	'./lines/build/base.min.js',
	'./lines/build/game.min.js',
];

const devFiles = [
	'./lines/build/lib/stats.js/build/stats.min.js'
];

function jsTask(done) {
	src(jsFiles)
		.pipe(sourcemaps.init())
		.pipe(concat('garden.min.js'))
		.pipe(uglify())
		.pipe(sourcemaps.write('./src_maps'))
		.pipe(dest('./build'))
		.on('error', function handleError() {
			this.emit('end'); // Recover from errors
		})
		.pipe(browserSync.stream());
	done();
}

function libTask(done) {
	src(libFiles)
		.pipe(sourcemaps.init())
		.pipe(concat('lib.min.js'))
		.pipe(uglify())
		.pipe(sourcemaps.write('./src_maps'))
		.pipe(dest('./build'))
		.on('error', function handleError() {
			this.emit('end'); // Recover from errors
		})
	done();
}

function watchTask(){
	watch('src/**/*.js', series('jsTask'));
	watch(doodoo.files, series(doodoo.task, libTask, reload));
}

task('jsTask', jsTask);
task('dev', series(doodoo.task, jsTask, libTask));
task('default', parallel(browserSyncTask, watchTask));
task('watch', parallel(browserSyncTask, watchTask));
