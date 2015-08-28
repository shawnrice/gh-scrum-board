////////
//////// Collections
////////

// Based on Issues
var IssueCollection = Backbone.Collection.extend({
  initialize: function(options) {
    this.repo = options.repo;
    this.repoOwner = options.repoOwner;
  },
	url: function() { return 'https://api.github.com/repos/' + this.repoOwner + '/' + this.repo + '/issues' },
	model: IssueModel,
});
var TaskCollection = Backbone.Collection.extend({
	name: null,
	model: TaskModel,
});
// Based on Labels
var LabelCollection = Backbone.Collection.extend({
  initialize: function(options) {
    this.repo = options.repo;
    this.repoOwner = options.repoOwner;
  },
	url: function() { return 'https://api.github.com/repos/' + this.repoOwner + '/' + this.repo + '/labels' },
	model: LabelModel,
});
var BoardCollection = Backbone.Collection.extend({
  initialize: function(options) {
    this.repo = options.repo;
    this.repoOwner = options.repoOwner;
  },
	url: function() { return 'https://api.github.com/repos/' + this.repoOwner + '/' + this.repo + '/milestones' },
	model: MilestoneModel,
});
var ColumnCollection = Backbone.Collection.extend({
	model: LabelModel,
});
// Based on Collaborators
var CollaboratorsCollection = Backbone.Collection.extend({
	// Note, this will fail unless the logged in user has push access to the repo.
	// I need to add in some error handling here.
  initialize: function(options) {
    this.repo = options.repo;
    this.repoOwner = options.repoOwner;
  },
	url: function() { return 'https://api.github.com/repos/' + this.repoOwner + '/' + this.repo + '/collaborators' },
	model: CollaboratorModel,
});