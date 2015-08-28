////////
//////// Main Controller
////////

// This is, basically, the overall controller, which we call the 'app'
var app = {
	collaborators: [],
	boards: {},
	init: function(repo, repoOwner) {
		console.log('Initializing app for ' + repo + '/' + repoOwner);
		this.repo = repo;
		this.repoOwner = repoOwner;
		this.dfd = new $.Deferred();
		this.initLabels();
		this.initIssues();
		this.initCollaborators();
		this.initBoards();
		return this.dfd.promise();
	},
	checkDeferred: function() {
		var deferreds = [ this.dfdCollaborators, this.dfdLabels, this.dfdIssues, this.dfdBoards ];
		var good = true;
		_.each(deferreds, function(deferred) {
			if ( 'resolved' != deferred.state() ) {
				good = false;
			}
		});
		if (true == good) {
			this.dfd.resolve('Loaded all data');
			console.log('Finished getting / populating data. Rendering canvas.');

			if ( 0 === this.boards.length || 0 === this.columns.length ) {
				$('#boards').append('<ul class="errors"><li><h1>Errors</h1></li></ul>');
				if ( 0 === this.boards.length ) {
					$('ul.errors').append('<li><h4>There are no boards.</h4></li>');
					$('ul.errors').append('<li><a href="#" id="new-board-modal-link"> + Create a board.</a></li>');
					$('#new-board-modal-link').on('click', function(event) {
						event.preventDefault();
						$('#new-board-modal').foundation('reveal','open');
					});
				}
				if ( 0 === this.columns.length ) {
					$('ul.errors').append('<li><h4>There are SCRUM states defined.</h4></li>');
					$('ul.errors').append('<li><a href="#" id="create-scrum-states">+ Create the SCRUM states.</a></li>');
					$('#create-scrum-states').on('click', function(event) {
						event.preventDefault();
						if ( confirm('Do you want to create the scrum labels?') ) {
							console.log('Creating SCRUM labels');
							_.each({
								'scrum-state-story': 'f7c6c7',
								'scrum-state-todo': 'fef2c0',
								'scrum-state-in-progress': 'd4c5f9',
								'scrum-state-to-verify': 'c7def8',
								'scrum-state-done': 'bfe5bf',
							}, function( color, name ) {
								console.log(name + ': ' + color);
								var url = 'https://api.github.com/repos/' + this.repoOwner + '/' + this.repo + '/labels';
								$.ajax({
							    url: url,
							    type: 'POST',
							    data: JSON.stringify( { name: name, color: color } ),
							    headers: setAuth(),
							    success: function(result) {
							    	console.log(result);
							    },
							    error: function(err) {
							    	console.log(err);
							    }
								});
							});
						}
					});
				}
				if ( 0 === this.tasks.length ) {
					$('ul.errors').append('<li><h4>There are no tasks defined.</h4></li>');
				}
			}
		}
	},
	initLabels: function() {
		this.dfdLabels = new $.Deferred();
		this.PopulateLabels();
	},
	initIssues: function() {
		this.dfdIssues = new $.Deferred();
		this.PopulateIssues();
	},
	initCollaborators: function() {
		this.dfdCollaborators = new $.Deferred();
		this.PopulateCollaborators();
	},
	initBoards: function() {
		this.dfdBoards = new $.Deferred();
		this.PopulateBoards();
	},
	SetBoards: function(data) {
		console.log("Setting boards");
		// this.boards = new BoardCollection(data);
	},
	SetColumns: function(data) {
		this.columns = new ColumnCollection(data);
	},
	PopulateLabels: function() {
		var _this = this;
		this.labelCollection = new LabelCollection({ repo: this.repo, repoOwner: this.repoOwner });
		this.labelCollection.fetch({
			headers: setAuth(),
			success: function(data) {
				this.labels = data.toJSON();
				boards = [];
				columns = [];
				_.each(this.labels, function(data) {
					if ('scrum-board-' == data.name.substr(0, 12)) {
						boards.push(data);
					}
					if ('scrum-state-' == data.name.substr(0, 12)) {
						columns.push(data);
					}
				});
				_this.SetBoards(boards);
				_this.SetColumns(columns);
				_this.dfdLabels.resolve('Populated label data.');
				_this.checkDeferred();
			},
			error: function(err) {
				_this.dfd.resolve('Promise for data retrieval not fulfilled.');
			}
		});
		this.columns = new ColumnCollection();
	},
	PopulateIssues: function() {
		var _this = this;
		this.issueCollection = new IssueCollection({ repo: this.repo, repoOwner: this.repoOwner });
		this.issueCollection.fetch({
			headers: setAuth(),
			success: function(data) {
				// Convert the issues to usable JSON
				this.issues = data.toJSON();
				var tasks = [];
				var boards = {};
				boards.issueStates = {};
				// // We're going to go through each label to see what it is...
				_.each(this.issues, function(issue){
					// We're now going to cycle through each issue to see what it is
					l = {};
					// We're not going to cycle through each label on each issue to see what
					// the "issue" is. Har. Har.
					_.each(issue.labels, function(label) {
						if ( 'scrum-state' == label.name.substr(0, 11)) {
							// The issue has a scrum-state on it. We can put it in a column!
							l.state = label.name;
						}
					});
					if ( undefined != issue.milestone ) {
						l.board = issue.milestone.id;
					}
					// This is a terrible way to code this, but it's at hack status right now.
					// See if the issue both is a task and has a state. If so, then we'll
					// include it in the collection of things to render.
					if ( (undefined !== l.board) && (undefined !== l.state) ) {
						if ( undefined == boards.issueStates[l.state] ) {
							// This particular state has not been defined yet, so we'll define it.
							boards.issueStates[l.state] = [issue];
						} else {
							// This state has been defined, so we'll push the issue into that state.
							boards.issueStates[l.state].push(issue);
						}
					}
				});
				// We need to get the keys of the issueStates object in order to cycle through
				// the object.
				var keys = Object.keys(boards.issueStates);
				_.each(keys, function(key) {
					tasks.push(new TaskCollection({name: key, collection: boards.issueStates[key]}));
				});
				_this.tasks = tasks;
				_this.dfdIssues.resolve('Populated issue data.');
				_this.checkDeferred();
			},
			error: function() {
				console.log('Doh! We have an "issue" getting the issues. Irony or meta?');
			},
		});
		this.tasks = new TaskCollection();
	},
	PopulateCollaborators: function() {
		var _this = this;
		console.log('Populating Collaborators');
		this.collaboratorCollection = new CollaboratorsCollection({ repo: this.repo, repoOwner: this.repoOwner });
		this.collaboratorCollection.fetch({
			headers: setAuth(),
			success: function(data) {
				_this.Access = true;
				_this.dfdCollaborators.resolve('Loaded collaborators');
				_this.checkDeferred();
			},
			error: function(err) {
				_this.Access = false;
				console.log('There was an error getting collaborators');
				_this.dfdCollaborators.resolve('Could not fetch collaborators.');
				_this.checkDeferred();
			}
		});
	},
	PopulateBoards: function() {
		var _this = this;
		console.log('Populating Boards');
		this.boardCollection = new BoardCollection({ repo: this.repo, repoOwner: this.repoOwner });
		this.boardCollection.fetch({
			headers: setAuth(),
			success: function(data) {
				_this.boards = data.toJSON();
				_this.dfdBoards.resolve('Loaded boards');
				_this.checkDeferred();
			},
			error: function(err) {
				console.log('Could not fetch boards');
				console.log(err);
				_this.dfdBoards.resolve('Could not fetch boards');
				_this.checkDeferred();
			}
		});
	},
};