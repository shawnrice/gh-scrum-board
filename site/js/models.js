////////
//////// Models
////////

// Based on Labels
var LabelModel = Backbone.Model.extend({
	url: '/api/labels',
  defaults: {
    name: null,
    url: null,
    color: null,
  }
});
var BoardModel = Backbone.Model.extend({
	defaults: {
		name: null,
		url: null,
		color: null,
	}
});
var ColumnModel = Backbone.Model.extend({
	defaults: {
		name: null,
		url: null,
		color: null,
		width: null,
	}
});

// Based on Issues
var IssueModel = Backbone.Model.extend({
  url: '/api/issues',
	defaults: {
		id: null,
		name: null,
		body: null,
		url: null,
		state: null,
		board: null,
		assignee: null,
	}
});
var TaskModel = Backbone.Model.extend({
	defaults: {
		name: null,
		body: null,
		url: null,
		state: null,
		board: null,
		assignee: null,
	}
});

// Based on Collaborators
var CollaboratorModel = Backbone.Model.extend({
	defaults: {
		login: null,
	}
});