var gulp = require('gulp'),
    spawn = require('child_process').spawn,
    node;
        // rename = require('gulp-rename');

// Since this is currently a development project, and since it will probably
// never go live, we're just taking some shortcuts and throwing in livereload
// to speed up development

gulp.task('server', function() {
  if (node) node.kill()
  node = spawn('node', ['server.js'], {stdio: 'inherit'})
  node.on('close', function (code) {
    if (code === 8) {
      gulp.log('Error detected, waiting for changes...');
    }
  });
});

var tinylr;
gulp.task('livereload', function() {
  tinylr = require('tiny-lr')();
    tinylr.listen(35729);
});

function notifyLiveReload(event) {
  var fileName = require('path').relative(__dirname, event.path);

  tinylr.changed({
    body: {
      files: [fileName]
    }
  });
}

gulp.task('watch', function() {
	gulp.watch('./site/**/*.js', notifyLiveReload);
	gulp.watch('./site/**/*.html', notifyLiveReload);
	gulp.watch('./site/**/*.css', notifyLiveReload);
	gulp.watch('./server.js', function() {
		gulp.run('server');
	});
});

gulp.task('default', ['server', 'livereload', 'watch'], function() {});

// clean up if an error goes unhandled.
process.on('exit', function() {
    if (node) node.kill()
})