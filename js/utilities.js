// Helper functions

function niceify(s) {
	return toTitleCase(s.replace('-', ' '));
}
//
function toTitleCase(str) {
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}
var toType = function(obj) {
  return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
};

// Retrieves the login from session storage
function getLogin() {
	return sessionStorage.getItem('login');
}
// Retrieves the password from session storage
function getPassword() {
	return sessionStorage.getItem('password');
}
// This builds the header information for ajax calls
function setAuth() {
	return { 'Authorization': 'Basic ' + Base64.encode( getLogin() + ':' + getPassword() ) };
}
// Gets the active repo name from session storage
function getRepo() {
	return sessionStorage.getItem('repo');
}
// Gets the repo owner from session storage
function getRepoOwner() {
	return sessionStorage.getItem('repoOwner');
}

function equalize() {
	$(document).foundation('equalizer', 'reflow');
}
function updateTabs() {
	$(document).foundation('tab', 'reflow');
}
function updateMenu() {
	$(document).foundation('offcanvas', 'reflow');
}

function buildBaseUrl() {
	return 'https://api.github.com/repos/' + getRepoOwner() + '/' + getRepo()
}

function buildLoginForm() {
		$('#login').html(
		  "<form id='login-form'>" +
		  	"<li>&nbsp;</li>" +
				"<li><input id='login-input' name='login' type='text' placeholder='Github name'></li>" +
				"<li><input id='password-input' name='password' type='password' placeholder='********'></li>" +
				"<li><center><button id='submit-login-info' class='button expand'>Login</button></center></li>" +
			"</form>"
		);
  $( '#login-form' ).on( 'submit', function( event ) {
  	event.preventDefault();
	  var form = {};
		$.each($(this).serializeArray(), function (i, field) {
    	form[field.name] = field.value || "";
		});
		$.ajax({
	    url: 'https://api.github.com',
	    type: 'GET',
	    headers: { 'Authorization': 'Basic ' + Base64.encode( form.login + ':' + form.password ) },
		  success: function (data) {
		  	if ( 401 == data.statusCode ) {
		  		alert('Could not login with those credentials');
		  		console.log('Error authenticating. Please check your credentials.');
		  	} else {
			  	console.log('Login successful');
			  	sessionStorage.setItem('login', form.login);
			  	sessionStorage.setItem('password', form.password);
			  	console.log('Saved credentials in session storage');
					buildLogoutLink(form);
					repoOwner = sessionStorage.getItem('repoOwner');
					repo = sessionStorage.getItem('repo');
					if ( repo && repoOwner ) {
						loadApp(repo, repoOwner);
					}
		  	}
		  },
		});
	});
}

function buildLogoutLink(form) {
	$('#login').html(
		'<li class="logged-in-name">@' + form.login + '</li>' +
		'<li class="logged-in-name"><a id="logmeout" href="#">Logout</a></li>'
	);

	// Bind the logout events to the link
	$('#logmeout').on( 'click', (function(event) {
		event.preventDefault();
		console.log('Tried to logout');
		unloadApp();

		sessionStorage.removeItem('password');
		sessionStorage.removeItem('login');
		buildLoginForm();

	}));
}

function createMilestone(repo, repoOwner, name) {
	var url = buildBaseUrl() + '/milestones';
	$.ajax({
    url: url,
    type: 'POST',
    data: JSON.stringify( { title: name } ),
    headers: setAuth(),
    success: function(result) {
    	console.log(result);
    },
    error: function(err) {
    	console.log(err);
    }
	}).done(function() {
		// Close the modal when everything is done.
		$('#new-board-modal').foundation('reveal','close');
	});
}

// Simple Base64 encoding.
var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9\+\/\=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/\r\n/g,"\n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}
