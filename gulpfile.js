var gulp = require('gulp');
        // rename = require('gulp-rename');

// Since this is currently a development project, and since it will probably
// never go live, we're just taking some shortcuts and throwing in livereload
// to speed up development

gulp.task('express', function() {
	// So, there is a slightly better version of this in `server.js`, and
	// this task should be changed to start/stop/restart that rather than
	// having the code replicated here.

	// Module dependencies.
	var application_root = __dirname,
	    express = require( 'express' ), //Web framework
	    bodyParser = require('body-parser'), //Parser for reading request body
	    path = require( 'path' ), //Utilities for dealing with file paths
	    fs = require( 'fs' );

	function getFileRealPath(s){
		s = __dirname + '/' + s;
	  try {
	  	return fs.realpathSync(s);
	  } catch(e) {
	  	return false;
	 	}
	}

	//Create server
	var app = express();
	app.use(require('connect-livereload')({port: 35729}));
	//Where to serve static content
	app.use( express.static( path.join( application_root, 'site') ) );
	app.use(bodyParser.urlencoded({
	  extended: true
	}));
	app.use(bodyParser.json());

	var Serve = function(endpoint, callback) {
		var Endpoints = {
			'collaborators': 'data/collaborators.json',
			'labels': 'data/labels.json',
			'issues': 'data/issues.json',
		};
		return callback(null, fs.readFile(Endpoints[endpoint], 'utf8', function (err,data) {
		  if (err) {
		    return console.log(err);
		  }
		  return data;
		}));
	}

	// Routes
	app.get( '/api/:endpoint', function( request, response ) {
		var realPath, pathToCheck = 'data/' + request.params.endpoint + '.json';
		if( ( realPath = getFileRealPath( pathToCheck ) ) === false ){
			response.send('[]');
		} else {
	    response.sendFile('data/' + request.params.endpoint + '.json', {root: __dirname });
		}
	});

	// Start server
	var port = 4711;

	app.listen( port, function() {
		console.log( 'Express server listening on port %d in %s mode', port, app.settings.env );
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
});

gulp.task('default', ['express', 'livereload', 'watch'], function() {});