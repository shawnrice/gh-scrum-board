// Module dependencies.
var application_root = __dirname,
    express = require( 'express' ), //Web framework
    bodyParser = require('body-parser'), //Parser for reading request body
    path = require( 'path' ), //Utilities for dealing with file paths
    fs = require( 'fs' );

//Create server
var app = express();
// Right now, we're using live-reload because this is, really, a development
// project.
app.use(require('connect-livereload')({port: 35729}));
app.use( express.static( path.join( application_root, 'site') ) );
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

function getFileRealPath(s){
	s = __dirname + '/' + s;
  try {
  	return fs.realpathSync(s);
  } catch(e) {
  	return false;
 	}
}

var Serve = function(endpoint, callback) {
	// Right now, this just grabs the data that has already been downloaded from
	// the Github API and saved as local files. This should, instead, either (1)
	// do the same but update the files via Github calls, or (2) grab the data
	// from Github itself.
	var Endpoints = {
		'collaborators': 'data/collaborators.json',
		'labels': 'data/labels.json',
		'issues': 'data/issues.json',
	};
	// console.log(Endpoints[endpoint]);
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
    response.sendfile('data/' + request.params.endpoint + '.json', {root: __dirname });
	}
});

//Start server
var port = 4711;

app.listen( port, function() {
	console.log( 'Express server listening on port %d in %s mode', port, app.settings.env );
});