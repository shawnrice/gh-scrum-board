////////
//////// Main Controller
////////

// This is, basically, the overall controller, which we call the 'app'
var app = {
	collaborators: [],
	init: function() {
		console.log('Initializing app');
		this.dfd = new $.Deferred();
		this.initLabels();
		this.initIssues();
		this.initCollaborators();
		return this.dfd.promise();
	},
	checkDeferred: function() {
		var deferreds = [ this.dfdCollaborators, this.dfdLabels, this.dfdIssues ];
		var good = true;
		_.each(deferreds, function(deferred) {
			if ( 'resolved' != deferred.state() ) {
				good = false;
			}
		});
		if (true == good) {
			this.dfd.resolve('Loaded all data');
			console.log('Finished getting / populating data. Rendering canvas.');
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
	SetBoards: function(data) {
		console.log("Setting boards");
		this.boards = new BoardCollection(data);
	},
	SetColumns: function(data) {
		this.columns = new ColumnCollection(data);
	},
	PopulateLabels: function() {
		var _this = this;
		this.labelCollection = new LabelCollection;
		this.labelCollection.fetch({
			success: function(data) {
				this.labels = data.toJSON();
				boards = [];
				columns = [];
				_.each(this.labels, function(data) {
					if ('scrum-board-' == data['name'].substr(0, 12)) {
						boards.push(data);
					}
					if ('scrum-state-' == data['name'].substr(0, 12)) {
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
		this.columns = new ColumnCollection;
	},
	PopulateIssues: function() {
		var _this = this;
		this.issueCollection = new IssueCollection;
		this.issueCollection.fetch({
			success: function(data) {
				// Convert the issues to usable JSON
				this.issues = data.toJSON();
				var tasks = [];
				var issueStates = {};
				// // We're going to go through each label to see what it is...
				_.each(this.issues, function(issue){
					// We're now going to cycle through each issue to see what it is
					l = {};
					// We're not going to cycle through each label on each issue to see what
					// the "issue" is. Har. Har.
					_.each(issue['labels'], function(label) {
						console.log(label);
						if ( 'scrum-task' == label['name'].substr(0, 10)) {
							// Issue is labeled as a task.
							l['task'] = label;
						}
						if ( 'scrum-board' == label['name'].substr(0, 11)) {
							// Issue is labeled with a particular board. We can put it on a board!
							// @todo: change the boards to milestones
							l['board'] = label['name'];
						}
						if ( 'scrum-state' == label['name'].substr(0, 11)) {
							// The issue has a scrum-state on it. We can put it in a column!
							l['state'] = label['name'];
						}
					});
					// This is a terrible way to code this, but it's at hack status right now.
					// See if the issue both is a task and has a state. If so, then we'll
					// include it in the collection of things to render.
					if ( (undefined !== l['task']) && (undefined !== l['state']) ) {
						if ( undefined == issueStates[l['state']] ) {
							// This particular state has not been defined yet, so we'll define it.
							issueStates[l['state']] = [issue];
						} else {
							// This state has been defined, so we'll push the issue into that state.
							issueStates[l['state']].push(issue);
						}
					}
				});
				// We need to get the keys of the issueStates object in order to cycle through
				// the object.
				var keys = Object.keys(issueStates);
				_.each(keys, function(key) {
					tasks.push(new TaskCollection({name: key, collection: issueStates[key]}));
				});
				_this.tasks = tasks;
				_this.issueStates = issueStates;
				_this.dfdIssues.resolve('Populated issue data.');
				_this.checkDeferred();
			},
			error: function() {
				console.log('Doh! We have an "issue" getting the issues. Irony or meta?');
			},
		});
		this.tasks = new TaskCollection;
	},
	PopulateCollaborators: function() {
		var _this = this;
		console.log('Populating Collaborators');
		this.collaboratorCollection = new CollaboratorsCollection;
		this.collaboratorCollection.fetch({
			success: function(data) {
				_this.dfdCollaborators.resolve('Loaded collaborators');
				_this.checkDeferred();
			},
			error: function(err) {
				console.log('There was an error getting collaborators');
				_this.dfdCollaborators.resolve('Could not fetch collaborators.');
			}
		});
	},
}