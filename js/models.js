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
		id: null,
		title: null,
		description: null,
		url: null,
		html_url: null,
		number: null,
	}
});
var ColumnModel = Backbone.Model.extend({
	defaults: {
		name: null,
		url: null,
		color: null,
		width: null,
		board: null,
		number: null,
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
		comments: 0,
		board: null,
		number: null,
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
		number: null,
	}
});

// Based on Collaborators
var CollaboratorModel = Backbone.Model.extend({
	defaults: {
		login: null,
	}
});

// Based on Collaborators
var MilestoneModel = Backbone.Model.extend({
	defaults: {
		title: null,
		url: null,
		number: null,
	}
});