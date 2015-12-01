var gulp        = require('gulp');
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;

var path = {
	src: 'src'
};

// Static server
gulp.task('serve', function() {

	browserSync.init({
		server: {
			baseDir: path.src,
			routes: {
				"/bower_components": "bower_components"
			}
		},
		options: {
			reloadDelay: 250
		},
		notify: false
	});

	gulp.watch(path.src+'/**/*.html').on('change', browserSync.reload);
	gulp.watch(path.src+'/**/*.css').on(['add','unlink'], browserSync.reload);
	gulp.watch(path.src+'/**/*.js').on(['add','unlink'], browserSync.reload);
	
});